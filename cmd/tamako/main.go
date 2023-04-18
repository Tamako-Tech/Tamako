package main

import (
	"fmt"
	"math/rand"
	"os"
	"os/signal"
	"runtime"
	"strings"
	"syscall"
	"time"

	"github.com/BearTS/Tamako/cmd/tamako/version"
	"github.com/BearTS/Tamako/internal/pkg/cache"
	shardmanager "github.com/BearTS/Tamako/internal/pkg/shard_manager"
	"github.com/bwmarrin/discordgo"
	"github.com/go-redis/redis"
	"github.com/kz/discordrus"
	"github.com/sirupsen/logrus"
)

var (
	BotRuntimeChannel chan os.Signal
)

func main() {
	var err error

	// Set up logger
	log := logrus.New()
	log.Out = os.Stdout
	log.Level = logrus.DebugLevel
	log.Formatter = &logrus.TextFormatter{ForceColors: true, FullTimestamp: true, TimestampFormat: time.RFC3339}
	log.Hooks = make(logrus.LevelHooks)
	cache.SetLogger(log)

	// Add webhook logger

	log.Hooks.Add(discordrus.NewHook(
		"Some webhook url", // ! Change this
		logrus.ErrorLevel,
		&discordrus.Opts{
			Username:           "Logging",
			DisableTimestamp:   false,
			TimestampFormat:    "Jan 2 15:04:05.00000",
			EnableCustomColors: true,
			CustomLevelColors: &discordrus.LevelColors{
				//Debug: 10170623,
				//Info:  3581519,
				//Warn:  14327864,
				Error: 13631488,
				Panic: 13631488,
				Fatal: 13631488,
			},
		},
	))

	log.WithField("module", "launcher").Info("Booting Tamako...")

	// Show version
	version.DumpInfo()

	// Make the randomness more random
	// Will be used for random number generation
	rand.Seed(time.Now().UTC().UnixNano())

	// Connect to redis
	log.WithField("module", "launcher").Info("Connecting to redis...")
	redisClient := redis.NewClient(&redis.Options{
		Addr:         "some redis addr", // ! Change this
		Password:     "",                // no password set
		DB:           0,                 // use default DB
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	})
	cache.SetRedisClient(redisClient)

	discordgo.Logger = func(msgL, caller int, format string, a ...interface{}) {
		pc, file, line, _ := runtime.Caller(caller)

		files := strings.Split(file, "/")
		file = files[len(files)-1]

		name := runtime.FuncForPC(pc).Name()
		fns := strings.Split(name, ".")
		name = fns[len(fns)-1]

		msg := format
		if strings.Contains(msg, "%") {
			msg = fmt.Sprintf(format, a...)
		}

		switch msgL {
		case discordgo.LogError:
			log.WithField("module", "discordgo").Errorf("%s:%d:%s() %s", file, line, name, msg)
		case discordgo.LogWarning:
			log.WithField("module", "discordgo").Warnf("%s:%d:%s() %s", file, line, name, msg)
		case discordgo.LogInformational:
			log.WithField("module", "discordgo").Infof("%s:%d:%s() %s", file, line, name, msg)
		case discordgo.LogDebug:
			log.WithField("module", "discordgo").Debugf("%s:%d:%s() %s", file, line, name, msg)
		}
	}

	log.WithField("module", "launcher").Info("Connecting to discord")

	discord := shardmanager.New("Bot " + "Token") // ! Change this
	if err != nil {
		panic(err)
	}

	discord.LogChannel = "log channel"                      // ! Change this
	discord.StatusMessageChannel = "status message channel" // ! Change this

	amount, err := discord.GetRecommendedCount()
	if err != nil {
		panic(err)
	}

	discord.SetNumShards(amount)

	// Add Event Handlers (add events/callbacks here)
	// discord.AddHandler(BotOnReady)

	cache.SetSession(discord)

	// connect all shards
	err = discord.Start()
	if err != nil {
		log.WithField("module", "launcher").Error("Error while connecting to discord")
		panic(err)
	}

	// Make a channel that waits for a os signal
	BotRuntimeChannel = make(chan os.Signal, 1)
	signal.Notify(BotRuntimeChannel, os.Interrupt, syscall.SIGTERM)

	// Wait until the os wants us to shutdown
	<-BotRuntimeChannel

	log.WithField("module", "launcher").Info("Tamako is stopping")

	// shutdown everything
	finished := make(chan bool, 1)
	go func() {
		log.WithField("module", "launcher").Info("Uninitializing plugins...")
		// BotDestroy() // ? To uninitialize all commands
		log.WithField("module", "launcher").Info("Disconnecting bot discord session...")
		discord.StopAll()
		// discord.Close()
		log.WithField("module", "launcher").Info("Disconnecting friend discord sessions...")
		for _, shardSession := range cache.GetShards() {
			shardSession.Close()
		}
		finished <- true
	}()

	select {
	case <-finished:
		log.WithField("module", "launcher").Infoln("shutdown successful")
	case <-time.After(60 * time.Second):
		log.WithField("module", "launcher").Infoln("forcing shutdown after 60 seconds")
	}

}

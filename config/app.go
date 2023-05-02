package config

import (
	"log"
	"path/filepath"
	"runtime"

	"github.com/kelseyhightower/envconfig"
)

type AppConfig struct {
	Env          string
	RootPath     string
	DiscordToken string `split_words:"true" json:"APP_DISCORD_TOKEN"`
	ApiUrl       string `split_words:"true" json:"APP_API_URL"`
}

var App *AppConfig

func loadAppConfig() {
	App = &AppConfig{}
	err := envconfig.Process("app", App)

	_, b, _, _ := runtime.Caller(0)
	App.RootPath = filepath.Join(filepath.Dir(b), "../")

	if err != nil {
		log.Fatal(err.Error())
	}
}

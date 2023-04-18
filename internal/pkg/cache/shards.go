package cache

import (
	"sync"

	"github.com/bwmarrin/discordgo"
)

// This is nothing but a wrapper around a slice of discordgo.Session
// It's used to store all the friends of the bot
// By friends i mean the other shards of the bot
var (
	shards      []*discordgo.Session
	shardsMutex sync.RWMutex
)

func AddShard(s *discordgo.Session) {
	shardsMutex.Lock()
	shards = append(shards, s)
	shardsMutex.Unlock()
}

func GetShards() []*discordgo.Session {
	shardsMutex.RLock()
	defer shardsMutex.RUnlock()

	return shards
}

func GetShard(guildID string) *discordgo.Session {
	shardsMutex.RLock()
	defer shardsMutex.RUnlock()

	for _, shard := range shards {
		for _, shardGuild := range shard.State.Guilds {
			if shardGuild.ID == guildID {
				return shard
			}
		}
	}

	return nil
}

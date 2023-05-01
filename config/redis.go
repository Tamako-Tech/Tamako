package config

import (
	"log"

	"github.com/kelseyhightower/envconfig"
)

type RedisConfig struct {
	Host              string `split_words:"true" json:"REDIS_HOST"`
	Port              string `split_words:"true" json:"REDIS_PORT"`
	Password          string `split_words:"true" json:"REDIS_PASSWORD"`
	DB                int    `split_words:"true" json:"REDIS_DB"`
	MaxRetries        int    `split_words:"true" json:"REDIS_MAX_RETRIES"`
	MinRetryBackoffMs int    `split_words:"true" json:"REDIS_MIN_RETRY_BACKOFF_MS"`
	MaxRetryBackoffMs int    `split_words:"true" json:"REDIS_MAX_RETRY_BACKOFF_MS"`
	WriteTimeoutMs    int    `split_words:"true" json:"REDIS_WRITE_TIMEOUT_MS"`
}

var Redis *RedisConfig

func loadRedisConfig() {
	Redis = &RedisConfig{}
	err := envconfig.Process("redis", Redis)
	if err != nil {
		log.Fatal(err.Error())
	}
}

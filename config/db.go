package config

import (
	"log"

	"github.com/kelseyhightower/envconfig"
)

type DBConfig struct {
	Host     string `split_words:"true" json:"DB_HOST"`
	Port     string `split_words:"true" json:"DB_PORT"`
	Database string `split_words:"true" json:"DB_DATABASE"`
	Username string `split_words:"true" json:"DB_USERNAME"`
	Password string `split_words:"true" json:"DB_PASSWORD"`
}

var DB *DBConfig

func loadDBConfig() {
	DB = &DBConfig{}
	err := envconfig.Process("db", DB)
	if err != nil {
		log.Fatal(err.Error())
	}
}

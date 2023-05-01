package postgres

import (
	"github.com/BearTS/Tamako/pkg/database/postgres/seeds"
	"gorm.io/gorm"
)

type Seed struct {
	TableName string
	Run       func(*gorm.DB) error
}

func Seeder(db *gorm.DB) []Seed {
	guilds := Seed{TableName: "guilds", Run: func(d *gorm.DB) error { return seeds.Guilds(db) }}

	return []Seed{
		guilds,
	}
}

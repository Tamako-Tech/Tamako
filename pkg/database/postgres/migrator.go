package postgres

import (
	"github.com/BearTS/Tamako/pkg/database/postgres/tables"
	"gorm.io/gorm"
)

type Migrate struct {
	TableName string
	Run       func(*gorm.DB) error
}

func AutoMigrate(db *gorm.DB) []Migrate {
	var guilds tables.Guilds

	guildsM := Migrate{TableName: "guilds",
		Run: func(d *gorm.DB) error { return db.AutoMigrate(&guilds) }}

	return []Migrate{
		guildsM,
	}
}

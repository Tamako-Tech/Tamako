package postgres

import (
	"database/sql"
	"log"
	"sync"
	"time"

	"github.com/BearTS/Tamako/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	once  sync.Once
	db    *gorm.DB
	sqlDB *sql.DB
)

func newConnection() (*gorm.DB, *sql.DB) {
	dsn := "host=" + config.DB.Host +
		" user=" + config.DB.Username +
		" password=" + config.DB.Password +
		" dbname=" + config.DB.Database +
		" port=" + config.DB.Port +
		" sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("[Connection], Error in opening db")
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("[Connection], Error in setting sqldb")
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return db, sqlDB
}

func GetConnection() (*gorm.DB, *sql.DB) {
	once.Do(func() {
		db, sqlDB = newConnection()
	})
	return db, sqlDB
}

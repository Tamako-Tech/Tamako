package guilds

import (
	"github.com/BearTS/Tamako/pkg/database/postgres/tables"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
type GormInterface interface {
	CreateGuildRecord(guild tables.Guilds) (tables.Guilds, error)
}

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */
func Gorm(gormDB *gorm.DB) *guildsGormImpl {
	return &guildsGormImpl{
		DB: gormDB,
	}
}

type guildsGormImpl struct {
	DB *gorm.DB
}

/* -------------------------------------------------------------------------- */
/*                                   Methods                                  */
/* -------------------------------------------------------------------------- */

// CreateGuildRecord creates a new guild record in the database
func (r *guildsGormImpl) CreateGuildRecord(guild tables.Guilds) (tables.Guilds, error) {
	err := r.DB.Session(&gorm.Session{}).Create(&guild).Error
	if err != nil {
		return guild, errors.Wrap(err, "[CreateGuildRecord]")
	}
	return guild, err
}

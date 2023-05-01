package tables

import "time"

type Guilds struct {
	ID               int    `gorm:"column:guilds_id;primaryKey;autoIncrement"`
	GuildID          string `gorm:"column:guilds_guild_id;uniqueIndex;type:varchar(20)"`
	GreetingsEnabled bool   `gorm:"column:guilds_greetings_enabled;default:false"`
	ChatBotEnabled   bool   `gorm:"column:guilds_chatbot_enabled;default:false"`
	ChatBotChannel   string `gorm:"column:guilds_chatbot_channel;type:varchar(20)"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

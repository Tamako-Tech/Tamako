package events

import (
	"context"
	"fmt"

	"github.com/BearTS/Tamako/pkg/database/postgres"
	"github.com/BearTS/Tamako/pkg/database/postgres/gorm/guilds"
	"github.com/BearTS/Tamako/pkg/database/postgres/tables"
	"github.com/BearTS/Tamako/services/logger"
	"github.com/andersfylling/disgord"
)

func guildCreate(ctx context.Context, client *disgord.Client) {
	gormDB, _ := postgres.GetConnection()

	guildsGorm := guilds.Gorm(gormDB)

	fmt.Println(disgord.AllEvents())

	// ! This does not work for some reason
	// Needs further debugging
	client.Gateway().GuildCreate(func(session disgord.Session, evt *disgord.GuildCreate) {
		logger.Info(fmt.Sprintf("Joined guild %s", evt.Guild.Name))
		_, err := guildsGorm.GetGuildByGuildID(evt.Guild.ID.String())
		if err != nil {
			// Guild does not exist in database
			// Create guild record

			var guildRecord tables.Guilds

			guildRecord.GuildID = evt.Guild.ID.String()

			_, err := guildsGorm.CreateGuildRecord(guildRecord)
			if err != nil {
				logger.Error(err, "Error creating guild record")
			}
		}

	})

	// This works, but I don't need it right now
	// client.Gateway().MessageCreate(func(session disgord.Session, evt *disgord.MessageCreate) {
	// 	fmt.Println(evt.Message.Content)
	// })
}

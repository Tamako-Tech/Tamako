package utility_embeds

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/BearTS/Tamako/pkg/structs"
	"github.com/BearTS/Tamako/services/registry"
	"github.com/andersfylling/disgord"
)

// GetPingEmbed returns an embed with the given latency and ping.
func GetPingEmbed(latency int64, ping time.Duration) (*disgord.Embed, *disgord.Embed) {

	loadingEmbed := &disgord.Embed{
		Title:       "Pinging...",
		Description: "Please wait...",
		Color:       0x00ff00,
	}

	finalEmbed := &disgord.Embed{
		Title: "Pong!",
		Color: 0x00ff00,
		Fields: []*disgord.EmbedField{
			{
				Name:   "API Latency",
				Value:  fmt.Sprintf("%d ms", latency),
				Inline: true,
			},
			{
				Name:   "Websocket Ping",
				Value:  fmt.Sprintf("%d ms", ping),
				Inline: true,
			},
		},
	}

	return loadingEmbed, finalEmbed
}

// GetAboutEmbed returns an embed with information about Tamako.
func GetAboutEmbed() *disgord.Embed {
	return &disgord.Embed{
		Title:       "About Tamako",
		Color:       0x00ff00,
		Description: `Tamako is a multi-purpose Discord bot written in Go.`,
		Fields: []*disgord.EmbedField{
			{
				Name:   "Author",
				Value:  "BearTS",
				Inline: true,
			},
			{
				Name:   "Source Code",
				Value:  "[GitHub](https://github.com/Tamako-Tech/Tamako)",
				Inline: true,
			},
			{
				Name:   "Invite",
				Value:  "Placeholder",
				Inline: true,
			},
			{
				Name:   "Support Server",
				Value:  "Placeholder",
				Inline: true,
			},
		},
	}
}

// GetHelpEmbed returns an embed with a list of commands.
func GetHelpEmbed(ctx context.Context) *disgord.Embed {

	// Create the embed.
	embed := &disgord.Embed{
		Title:       "Help",
		Description: "Here is a list of commands.",
		Color:       0x00ff00,
	}

	var commandMap []structs.CommandsMap

	// Get From Registry
	commandsFromRegistry, _ := registry.GetInstance().GetValue("commands")
	if err := json.Unmarshal(commandsFromRegistry, &commandMap); err != nil {
		fmt.Println(err)
	}

	for _, command := range commandMap {
		// Category, Name, Description, Help
		embed.Fields = append(embed.Fields, &disgord.EmbedField{
			Name:   fmt.Sprintf("%s - %s", command.Category, command.Name),
			Value:  fmt.Sprintf("%s\n%s", command.Description, command.Help),
			Inline: false,
		})
	}

	return embed
}

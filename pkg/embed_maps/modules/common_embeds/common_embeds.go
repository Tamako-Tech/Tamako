package common_embeds

import (
	"fmt"
	"time"

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

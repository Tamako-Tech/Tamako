package common

import (
	"context"
	"fmt"
	"time"

	"github.com/andersfylling/disgord"
)

// PingCommand struct
type PingCommand struct{}

func (p PingCommand) Name() string {
	return "ping"
}

func (p PingCommand) Help() string {
	return "Responds with 'pong'"
}

func (p PingCommand) Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error {
	// Record the current time.
	t1 := time.Now()

	// Send a message to measure the time taken to edit it.
	editMsg, err := msg.Reply(context.Background(), s, "Pinging...")
	if err != nil {
		return err
	}

	// Record the time taken to send the message and edit it.
	t2 := time.Now()
	latency := t2.Sub(t1).Milliseconds()

	// Calculate the websocket ping.
	ping, _ := s.AvgHeartbeatLatency()

	// Create the embed.
	embed := &disgord.Embed{
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

	// delete the original message.
	if err = s.Channel(editMsg.ChannelID).Message(editMsg.ID).Delete(); err != nil {
		return err
	}

	// Edit the message with the embed.
	editMsg, err = editMsg.Reply(context.Background(), s, embed)

	if err != nil {
		return err
	}

	// Delete the message after 5 seconds.
	go deleteMessageAfterDelay(s, editMsg, 5*time.Second)

	// delete the user message after 5 seconds.
	go deleteMessageAfterDelay(s, msg, 5*time.Second)

	return nil
}

func deleteMessageAfterDelay(s disgord.Session, msg *disgord.Message, delay time.Duration) {
	<-time.After(delay)
	if err := s.Channel(msg.ChannelID).Message(msg.ID).Delete(); err != nil {
		return
	}
}

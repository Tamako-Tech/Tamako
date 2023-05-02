package utility

import (
	"context"

	"github.com/BearTS/Tamako/pkg/common/embed_maps/utility_embeds"

	"github.com/andersfylling/disgord"
)

// PingCommand struct
type PingCommand struct{}

func (p PingCommand) Name() string {
	return "ping"
}

func (p PingCommand) Aliases() []string {
	return []string{"pong"}
}

func (p PingCommand) Help() string {
	return "Responds with 'pong'"
}

func (p PingCommand) Description() string {
	return "Responds with 'pong'"
}

func (p PingCommand) Category() string {
	return "utility"
}

func (p PingCommand) Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error {

	// Create the loading embed.
	loadingEmbed, _ := utility_embeds.GetPingEmbed(0)

	// Send a message to measure the time taken to edit it.
	editMsg, err := msg.Reply(context.Background(), s, loadingEmbed)
	if err != nil {
		return err
	}

	// Check difference between the two times.
	ping := editMsg.Timestamp.Time.Sub(msg.Timestamp.Time)

	// Create the embed.
	_, embed := utility_embeds.GetPingEmbed(ping)

	// delete the original message.
	if err = s.Channel(editMsg.ChannelID).Message(editMsg.ID).Delete(); err != nil {
		return err
	}

	// Edit the message with the embed.
	_, err = editMsg.Reply(context.Background(), s, embed)

	if err != nil {
		return err
	}

	return nil
}

// func deleteMessageAfterDelay(s disgord.Session, msg *disgord.Message, delay time.Duration) {
// 	<-time.After(delay)
// 	if err := s.Channel(msg.ChannelID).Message(msg.ID).Delete(); err != nil {
// 		return
// 	}
// }

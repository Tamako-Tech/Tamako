package utility

import (
	"context"

	"github.com/BearTS/Tamako/pkg/common/embed_maps/utility_embeds"
	"github.com/andersfylling/disgord"
)

// ServerinfoCommand struct
type ServerinfoCommand struct{}

func (s ServerinfoCommand) Name() string {
	return "serverinfo"
}

func (s ServerinfoCommand) Aliases() []string {
	return []string{"si"}
}

func (s ServerinfoCommand) Help() string {
	return "Shows information about the server."
}

func (s ServerinfoCommand) Description() string {
	return "Shows information about the server."
}

func (s ServerinfoCommand) Category() string {
	return "utility"
}

func (s ServerinfoCommand) Run(ctx context.Context, disgordSession disgord.Session, msg *disgord.Message) error {

	// get info
	server, _ := disgordSession.Guild(msg.GuildID).Get()

	serverEmbed := utility_embeds.GetServerinfoEmbed(server)

	// Send the reply
	if _, err := msg.Reply(context.Background(), disgordSession, serverEmbed); err != nil {
		return err
	}

	return nil
}

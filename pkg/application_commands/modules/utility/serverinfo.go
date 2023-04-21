package utility

import (
	"context"

	"github.com/BearTS/Tamako/pkg/common/embed_maps/utility_embeds"
	"github.com/andersfylling/disgord"
)

// Serverinfo Command
type ServerinfoCommand struct{}

func (ServerinfoCommand) Name() string {
	return "serverinfo"
}

func (ServerinfoCommand) Description() string {
	return "Shows information about the server."
}

func (ServerinfoCommand) Options() []*disgord.ApplicationCommandOption {
	return nil
}

func (ServerinfoCommand) Run(ctx context.Context, s disgord.Session, interaction *disgord.InteractionCreate) error {

	// get server
	server, _ := s.Guild(interaction.GuildID).Get()

	// get info
	serverEmbed := utility_embeds.GetServerinfoEmbed(server)

	// Reply to the interaction
	if err := interaction.Reply(ctx, s, &disgord.CreateInteractionResponse{
		Type: disgord.InteractionCallbackChannelMessageWithSource,
		Data: &disgord.CreateInteractionResponseData{
			Embeds: []*disgord.Embed{serverEmbed},
		},
	}); err != nil {
		return err
	}

	return nil
}

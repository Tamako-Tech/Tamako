package utility

import (
	"context"

	"github.com/BearTS/Tamako/pkg/common/embed_maps/utility_embeds"
	"github.com/andersfylling/disgord"
)

// UserinfoCommand ...
type UserinfoCommand struct{}

// Name ...
func (UserinfoCommand) Name() string {
	return "userinfo"
}

// Description ...
func (UserinfoCommand) Description() string {
	return "Shows info about a user."
}

func (UserinfoCommand) Options() []*disgord.ApplicationCommandOption {
	return []*disgord.ApplicationCommandOption{
		{
			Type:        int(disgord.ApplicationCommandUser),
			Name:        "user",
			Description: "The user to show info about.",
			Required:    false,
		},
	}
}

// ! Need to test this.
// Run ...
func (UserinfoCommand) Run(ctx context.Context, s disgord.Session, interaction *disgord.InteractionCreate) error {
	// Get the mentioned user.
	var user *disgord.User
	if interaction.Data.Options != nil {
		user = interaction.Data.Options[0].Value.(*disgord.User)
	} else {
		user = interaction.Member.User
	}

	// Get the user's info.
	userEmbed := utility_embeds.GetUserinfoEmbed(user)

	// Reply to the interaction.
	if err := interaction.Reply(ctx, s, &disgord.CreateInteractionResponse{
		Type: disgord.InteractionCallbackChannelMessageWithSource,
		Data: &disgord.CreateInteractionResponseData{
			Embeds: []*disgord.Embed{userEmbed},
		},
	}); err != nil {
		return err
	}

	return nil
}

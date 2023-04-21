package common

import (
	"context"

	"github.com/BearTS/Tamako/pkg/embed_maps/modules/common_embeds"

	"github.com/andersfylling/disgord"
)

// AboutCommand struct
type AboutCommand struct{}

func (a AboutCommand) Name() string {
	return "about"
}

func (a AboutCommand) Help() string {
	return "About Tamako"
}

func (a AboutCommand) Description() string {
	return "About Tamako"
}

func (a AboutCommand) Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error {

	// Create the embed.
	updatedEmbed := common_embeds.GetAboutEmbed()

	// Send the reply
	if _, err := msg.Reply(context.Background(), s, updatedEmbed); err != nil {
		return err
	}

	return nil
}

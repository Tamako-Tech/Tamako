package action

import (
	"context"

	"github.com/BearTS/Tamako/pkg/common/embed_maps/action_embeds"
	"github.com/andersfylling/disgord"
)

// BakaCommand struct
type BakaCommand struct{}

func (a BakaCommand) Name() string {
	return "baka"
}

func (a BakaCommand) Aliases() []string {
	return []string{}
}

func (a BakaCommand) Help() string {
	return "Sends a baka gif"
}

func (a BakaCommand) Description() string {
	return "Sends a baka gif"
}

func (a BakaCommand) Category() string {
	return "action"
}

func (a BakaCommand) Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error {
	var embed *disgord.Embed

	if len(msg.Mentions) > 0 {
		embed = action_embeds.GetBakaEmbed(msg.Mentions[0])
	} else {
		embed = action_embeds.GetBakaEmbed(msg.Author)
	}

	// Send the reply
	if _, err := msg.Reply(context.Background(), s, embed); err != nil {
		return err
	}

	return nil
}

package utility

import (
	"context"

	"github.com/BearTS/Tamako/pkg/common/embed_maps/utility_embeds"

	"github.com/andersfylling/disgord"
)

type HelpCommand struct{}

func (h HelpCommand) Name() string {
	return "help"
}

func (h HelpCommand) Aliases() []string {
	return []string{"h"}
}

func (h HelpCommand) Help() string {
	return "Shows a list of commands."
}

func (h HelpCommand) Description() string {
	return "Shows a list of commands."
}

func (h HelpCommand) Category() string {
	return "utility"
}

func (h HelpCommand) Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error {
	embed := utility_embeds.GetHelpEmbed(ctx)
	_, err := msg.Reply(context.Background(), s, embed)
	return err
}

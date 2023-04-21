package modules

import (
	"context"

	"github.com/BearTS/Tamako/pkg/application_commands/modules/common"
	"github.com/andersfylling/disgord"
)

var Commands = []*disgord.CreateApplicationCommand{
	// Common Commands
	{
		Name:        common.PingCommand{}.Name(),
		Description: common.PingCommand{}.Description(),
		Options:     common.PingCommand{}.Options(),
	},
}

type Command interface {
	Name() string
	Description() string
	Options() []*disgord.ApplicationCommandOption
	Run(ctx context.Context, s disgord.Session, interaction *disgord.InteractionCreate) error
}

var CommandsMap = map[string]Command{
	// Common Commands
	common.PingCommand{}.Name():  common.PingCommand{},
	common.AboutCommand{}.Name(): common.AboutCommand{},
}

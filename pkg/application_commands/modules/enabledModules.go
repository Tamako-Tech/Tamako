package modules

import (
	"context"

	"github.com/BearTS/Tamako/pkg/application_commands/modules/common"
	"github.com/andersfylling/disgord"
)

var Commands = map[Command]*disgord.CreateApplicationCommand{
	// Common Commands
	common.PingCommand{}: {
		Name:        common.PingCommand{}.Name(),
		Description: common.PingCommand{}.Description(),
		Options:     common.PingCommand{}.Options(),
	},
	common.AboutCommand{}: {
		Name:        common.AboutCommand{}.Name(),
		Description: common.AboutCommand{}.Description(),
		Options:     common.AboutCommand{}.Options(),
	},
}

type Command interface {
	Name() string
	Description() string
	Options() []*disgord.ApplicationCommandOption
	Run(ctx context.Context, s disgord.Session, interaction *disgord.InteractionCreate) error
}


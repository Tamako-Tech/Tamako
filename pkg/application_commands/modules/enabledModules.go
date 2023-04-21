package modules

import (
	"context"

	"github.com/BearTS/Tamako/pkg/application_commands/modules/utility"

	"github.com/andersfylling/disgord"
)

var Commands = map[Command]*disgord.CreateApplicationCommand{
	// Common Commands
	utility.PingCommand{}: {
		Name:        utility.PingCommand{}.Name(),
		Description: utility.PingCommand{}.Description(),
		Options:     utility.PingCommand{}.Options(),
	},
	utility.AboutCommand{}: {
		Name:        utility.AboutCommand{}.Name(),
		Description: utility.AboutCommand{}.Description(),
		Options:     utility.AboutCommand{}.Options(),
	},
	utility.ServerinfoCommand{}: {
		Name:        utility.ServerinfoCommand{}.Name(),
		Description: utility.ServerinfoCommand{}.Description(),
		Options:     utility.ServerinfoCommand{}.Options(),
	},
	utility.UserinfoCommand{}: {
		Name:        utility.UserinfoCommand{}.Name(),
		Description: utility.UserinfoCommand{}.Description(),
		Options:     utility.UserinfoCommand{}.Options(),
	},
}

type Command interface {
	Name() string
	Description() string
	Options() []*disgord.ApplicationCommandOption
	Run(ctx context.Context, s disgord.Session, interaction *disgord.InteractionCreate) error
}

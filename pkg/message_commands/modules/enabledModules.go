package modules

import (
	"context"

	"github.com/BearTS/Tamako/pkg/message_commands/modules/utility"

	"github.com/andersfylling/disgord"
)

// Command interface
type Command interface {
	Name() string
	Help() string
	Category() string
	Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error
}

var CommandsMap = map[string]Command{
	// utility Commands
	utility.PingCommand{}.Name():  utility.PingCommand{},
	utility.AboutCommand{}.Name(): utility.AboutCommand{},
}

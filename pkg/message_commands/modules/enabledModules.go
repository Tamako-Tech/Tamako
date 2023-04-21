package modules

import (
	"context"

	"github.com/BearTS/Tamako/pkg/message_commands/modules/common"
	"github.com/andersfylling/disgord"
)

// Command interface
type Command interface {
	Help() string
	Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error
}

var CommandsMap = map[string]Command{
	// common Commands
	common.PingCommand{}.Name():  common.PingCommand{},
	common.AboutCommand{}.Name(): common.AboutCommand{},
}

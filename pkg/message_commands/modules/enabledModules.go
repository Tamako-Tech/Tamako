package modules

import (
	"github.com/BearTS/Tamako/pkg/interfaces"
	"github.com/BearTS/Tamako/pkg/message_commands/modules/utility"
)

var CommandsMap = map[string]interfaces.MessageCommand{
	// utility Commands
	utility.PingCommand{}.Name():     utility.PingCommand{},
	utility.AboutCommand{}.Name():    utility.AboutCommand{},
	utility.HelpCommand{}.Name():     utility.HelpCommand{},
	utility.UserInfoCommand{}.Name(): utility.UserInfoCommand{},
}

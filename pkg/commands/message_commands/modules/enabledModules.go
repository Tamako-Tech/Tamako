package modules

import (
	"github.com/BearTS/Tamako/pkg/commands/message_commands/modules/utility"
	"github.com/BearTS/Tamako/pkg/interfaces"
)

var CommandsMap = map[string]interfaces.MessageCommand{
	// utility Commands
	utility.PingCommand{}.Name():       utility.PingCommand{},
	utility.AboutCommand{}.Name():      utility.AboutCommand{},
	utility.HelpCommand{}.Name():       utility.HelpCommand{},
	utility.UserInfoCommand{}.Name():   utility.UserInfoCommand{},
	utility.ServerinfoCommand{}.Name(): utility.ServerinfoCommand{},
}

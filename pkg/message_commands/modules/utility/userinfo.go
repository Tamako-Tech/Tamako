package utility

import (
	"context"
	"fmt"

	"github.com/BearTS/Tamako/pkg/common/embed_maps/utility_embeds"
	"github.com/BearTS/Tamako/services/logger"
	"github.com/andersfylling/disgord"
)

// UserInfoCommand struct
type UserInfoCommand struct{}

func (u UserInfoCommand) Name() string {
	return "userinfo"
}

func (u UserInfoCommand) Help() string {
	return "Shows information about a user."
}

func (u UserInfoCommand) Description() string {
	return "Shows information about a user."
}

func (u UserInfoCommand) Category() string {
	return "utility"
}

func (u UserInfoCommand) Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error {
	var embed *disgord.Embed
	fmt.Println(msg.Mentions)
	if len(msg.Mentions) > 0 {
		embed = utility_embeds.GetUserinfoEmbed(msg.Mentions[0])
	} else {
		embed = utility_embeds.GetUserinfoEmbed(msg.Author)
	}
	// Send the reply
	if _, err := msg.Reply(context.Background(), s, embed); err != nil {
		logger.Error("Failed to send message: %v", err)
		return err
	}

	return nil
}

package common

import (
	"context"

	"github.com/andersfylling/disgord"
)

// PingCommand struct
type PingCommand struct{}

func (p PingCommand) Name() string {
	return "ping"
}

func (p PingCommand) Help() string {
	return "Responds with 'pong'"
}

func (p PingCommand) Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error {
	_, err := msg.Reply(ctx, s, "pong")
	if err != nil {
		return err
	}
	return nil
}

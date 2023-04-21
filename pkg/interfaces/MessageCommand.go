package interfaces

import (
	"context"

	"github.com/andersfylling/disgord"
)

// Command interface
type MessageCommand interface {
	Name() string
	Help() string
	Category() string
	Description() string
	Run(ctx context.Context, s disgord.Session, msg *disgord.Message) error
}

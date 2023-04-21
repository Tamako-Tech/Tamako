package events

import (
	"context"

	"github.com/andersfylling/disgord"
)

func LoadEvents(ctx context.Context, client *disgord.Client) error {
	botOnReady(ctx, client)

	return nil
}

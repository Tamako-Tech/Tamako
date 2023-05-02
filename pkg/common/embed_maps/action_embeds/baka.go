package action_embeds

import (
	"github.com/BearTS/Tamako/pkg/extensions/main_api/roleplay"
	"github.com/BearTS/Tamako/services/logger"
	"github.com/andersfylling/disgord"
)

func GetBakaEmbed(user *disgord.User) *disgord.Embed {

	roleplay, err := roleplay.GetRoleplayData("baka")
	if err != nil {
		logger.Error("Failed to get roleplay data: %v", err)
	}

	url := roleplay.URL

	finalEmbed := &disgord.Embed{
		Title: "Baka~",
		Color: 0x00ff00,
		Image: &disgord.EmbedImage{
			URL: url,
		},
	}

	if user != nil {
		description := user.Mention() + " Baka~"
		finalEmbed.Description = description
	}

	return finalEmbed
}

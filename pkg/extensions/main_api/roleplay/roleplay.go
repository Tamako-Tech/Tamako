package roleplay

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/BearTS/Tamako/config"
	"github.com/BearTS/Tamako/services/logger"
	"github.com/pkg/errors"
)

type roleplayResponse struct {
	API  string `json:"Api"`
	Type string `json:"Type"`
	URL  string `json:"url"`
}

var AvailableRoleplayTypes = []string{
	"baka",
	"blush",
	"bite",
	"celebrate",
	"cry",
	"dance",
	"disgust",
	"eat",
	"explode",
	"feed",
	"fistbump",
	"happy",
	"highfive",
	"holdhands",
	"hug",
	"hug",
	"inhale",
	"kill",
	"kiss",
	"lick",
	"midfing",
	"pat",
	"poke",
	"punch",
	"slap",
	"sleep",
	"smile",
	"smug",
	"suicide",
	"tickle",
	"wave",
	"wink",
}

func GetRoleplayData(roleplayType string) (roleplayResponse, error) {
	var res roleplayResponse

	url := config.App.ApiUrl + "/roleplay/" + roleplayType

	req, _ := http.NewRequest("GET", url, nil)

	response, err := http.DefaultClient.Do(req)
	if err != nil {
		err = errors.Wrap(err, "[GetRoleplayData]")
		logger.Error(err)
		return res, err
	}

	if response.StatusCode != 200 {
		err = errors.Wrap(err, "Error getting roleplay data")
		logger.Error(err)
		return res, err
	}

	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		return res, errors.Wrap(err, "[GetRoleplayData][ReadAll]")
	}

	err = json.Unmarshal(body, &res)
	if err != nil {
		return res, errors.Wrap(err, "[GetRoleplayData][Unmarshal]")
	}

	return res, nil
}

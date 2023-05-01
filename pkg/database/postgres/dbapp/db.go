package main

import (
	"net/http"

	"github.com/BearTS/Tamako/config"
	"github.com/BearTS/Tamako/pkg/database/postgres/commands"
	"github.com/spf13/cobra"
)

func main() {
	db()
}

func db() {
	config.LoadConfigs()
	cmd := &cobra.Command{}

	cmd.AddCommand(commands.DropTables())
	cmd.AddCommand(commands.Migrate())
	cmd.AddCommand(commands.Seed())
	err := cmd.Execute()
	if err != nil {
		panic(err)
	}

	if config.App.Env != "development" {
		err = http.ListenAndServe(":8080", nil)
		if err != nil {
			panic(err.Error() + ". Error in DBMain")
		}
	}
}

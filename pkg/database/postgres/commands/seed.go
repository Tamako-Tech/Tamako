package commands

import (
	"fmt"

	"github.com/BearTS/Tamako/config"
	"github.com/BearTS/Tamako/pkg/database/postgres"
	"github.com/spf13/cobra"
)

func Seed() *cobra.Command {
	var err error
	return &cobra.Command{
		Use: "seed",
		RunE: func(cmd *cobra.Command, args []string) error {
			if config.App.Env != "development" {
				fmt.Println("Warning: Environment is not development. Tables wont be seeded")
				return nil
			}
			fmt.Println("App env is development")
			dbConnection, sqlConnection := postgres.Connection()
			defer sqlConnection.Close()
			begin := dbConnection.Begin()

			for i, seed := range postgres.Seeder(begin) {
				if err = seed.Run(begin); err != nil {
					begin.Rollback()
					fmt.Println("[Seeder] Running seed failed")
					panic(err)
				}
				fmt.Println("[", i, "]: ", "Seed table: ", seed.TableName)
			}
			begin.Commit()
			fmt.Println("Seeding Completed")
			return nil
		},
	}
}

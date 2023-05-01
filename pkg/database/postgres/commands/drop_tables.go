package commands

import (
	"errors"
	"fmt"

	"github.com/BearTS/Tamako/config"
	"github.com/BearTS/Tamako/pkg/database/postgres"
	"github.com/spf13/cobra"
)

func DropTables() *cobra.Command {
	return &cobra.Command{
		Use: "droptables",
		RunE: func(cmd *cobra.Command, args []string) error {
			if config.App.Env != "development" {
				fmt.Println("Warning: Environment is not development. Tables wont be dropped")
				return nil
			}
			fmt.Println("App env is development")

			dbConnection, sqlConnection := postgres.Connection()
			defer sqlConnection.Close()

			var tableNames []string
			if err := dbConnection.Table("information_schema.tables").
				Where("table_schema = ?", "public").Pluck("table_name", &tableNames).Error; err != nil {
				panic(err)
			}

			if len(tableNames) > 0 {
				for i, tableName := range tableNames {
					if err := dbConnection.Migrator().DropTable(tableName); err != nil {
						return errors.New("Error: While dropping tables:" + tableName)
					}
					fmt.Println("[", i, "]: ", "dropped table: ", tableName)
				}
			}
			fmt.Println("Dropped all tables sucessfully")
			return nil
		},
	}
}

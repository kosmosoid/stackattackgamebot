package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	"github.com/kosmosoid/stackattackbot/internal/api"
	"github.com/kosmosoid/stackattackbot/internal/logging"
	"github.com/kosmosoid/stackattackbot/internal/repository"
	"github.com/kosmosoid/stackattackbot/internal/service"
	"github.com/kosmosoid/stackattackbot/internal/telegram"
)

func main() {

	postgresDB, err := repository.NewPostgresDB(os.Getenv("POSTGRES_DSN"))
	if err != nil {
		log.Fatalf("Failed to connect to Postgres: %v", err)
	}

	cacheBig, err := repository.NewCache()
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	Bot, err := telegram.NewBot(os.Getenv("TELEGRAM_BOT_TOKEN"))
	if err != nil {
		log.Fatalf("Failed to create Telegram bot: %v", err)
	}
	svc := service.NewService(postgresDB, cacheBig, Bot)
	Bot.SetService(svc)

	go Bot.Start()

	router := gin.New()
	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - HTTPS - %s - %s - %s - %d - %s - %s\n",
			param.TimeStamp.Format(time.DateTime),
			param.ClientIP,
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.ErrorMessage,
		)
	}))
	router.Use(gin.Recovery())
	router.LoadHTMLGlob("web/templates/*")
	router.Static("/static", "./web/")

	api.RegisterHandlers(router, svc)

	srvMain := &http.Server{
		Addr:         ":" + os.Getenv("HTTPS_PORT"),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		ErrorLog:     log.New(logging.Logger, "HTTPS", 0),
	}

	logging.Debug("Start server")
	log.Fatalln(srvMain.ListenAndServe())

}

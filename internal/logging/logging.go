package logging

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/rs/zerolog"
)

var (
	Logger zerolog.Logger
)

func Setup() {
	runLogFile, _ := os.OpenFile(
		"bot.log",
		os.O_APPEND|os.O_CREATE|os.O_WRONLY,
		0664,
	)

	output := zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.DateTime, NoColor: true}
	output.FormatLevel = func(i interface{}) string {
		return strings.ToUpper(fmt.Sprintf("- %s -", i))
	}
	output.FormatMessage = func(i interface{}) string {
		return fmt.Sprintf("%s", i)
	}
	output.FormatFieldName = func(i interface{}) string {
		return fmt.Sprintf("%s:", i)
	}
	output.FormatFieldValue = func(i interface{}) string {
		return strings.ToUpper(fmt.Sprintf("%s", i))
	}

	multi := zerolog.MultiLevelWriter(os.Stdout, runLogFile, output)

	Logger = zerolog.New(multi).With().Timestamp().Logger()
}

func Debug(s string, v ...interface{}) {
	if len(v) == 0 {
		Logger.Print(s)
	} else {
		Logger.Printf(s, v...)
	}
}

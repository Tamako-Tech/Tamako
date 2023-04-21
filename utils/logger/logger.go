package logger

import (
	"os"

	"github.com/sirupsen/logrus"
)

var log = &logrus.Logger{
	Out:       os.Stderr,
	Formatter: new(logrus.TextFormatter),
	Hooks:     make(logrus.LevelHooks),
	Level:     logrus.InfoLevel,
}

func Info(args ...interface{}) {
	log.Info(args...)
}

func Warn(args ...interface{}) {
	log.Warn(args...)
}

func Error(args ...interface{}) {
	// check if the error is nil
	if args[0] == nil {
		return
	}
	log.Error(args...)
}

func Trace(args ...interface{}) {
	log.WithFields(logrus.Fields{
		"trace": args[1],
	}).Error(args[0])
}

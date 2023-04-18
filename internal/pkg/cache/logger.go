package cache

import (
	"sync"

	"github.com/sirupsen/logrus"
)

var (
	logger      *logrus.Logger
	loggerMutex sync.RWMutex
)

func SetLogger(s *logrus.Logger) {
	loggerMutex.Lock()
	logger = s
	loggerMutex.Unlock()
}

func GetLogger() *logrus.Logger {
	loggerMutex.RLock()
	defer loggerMutex.RUnlock()

	if logger == nil {
		panic("Tried to get logger before logger#SetLogger() was called")
	}

	return logger
}

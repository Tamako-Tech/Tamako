package cache

import (
	"sync"

	shardManager "github.com/BearTS/Tamako/internal/pkg/shard_manager"
)

var (
	session      *shardManager.Manager
	sessionMutex sync.RWMutex
)

func SetSession(s *shardManager.Manager) {
	sessionMutex.Lock()
	session = s
	sessionMutex.Unlock()
}

func GetSession() *shardManager.Manager {
	sessionMutex.RLock()
	defer sessionMutex.RUnlock()

	if session == nil {
		panic("Tried to get discord session before cache#SetSession() was called")
	}

	return session
}

func IsSession() bool {
	sessionMutex.RLock()
	defer sessionMutex.RUnlock()

	return session != nil
}

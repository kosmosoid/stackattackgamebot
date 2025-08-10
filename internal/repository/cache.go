package repository

import (
	"strconv"
	"time"

	"github.com/allegro/bigcache"
	"github.com/kosmosoid/stackattackbot/internal/logging"
)

func ID(id int) string {
	return strconv.Itoa(id)
}

type CacheRepository struct {
	instance *bigcache.BigCache
}

func NewCache() (*CacheRepository, error) {
	cacheConfig := bigcache.Config{
		Shards:           1024,
		LifeWindow:       10 * time.Minute,
		CleanWindow:      5 * time.Minute,
		MaxEntrySize:     500,
		HardMaxCacheSize: 8192,
		Verbose:          true,
	}

	cache, err := bigcache.NewBigCache(cacheConfig)
	if err != nil {
		logging.Debug(err.Error())
		return nil, err
	}

	return &CacheRepository{instance: cache}, nil
}

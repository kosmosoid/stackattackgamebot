package service

import (
	"context"

	"github.com/kosmosoid/stackattackbot/internal/models"
	"github.com/kosmosoid/stackattackbot/internal/repository"
)

type Service struct {
	postgresRepo *repository.PostgresRepository
	cacheRepo    *repository.CacheRepository
	telegramBot  TelegramBot
}

func NewService(postgresRepo *repository.PostgresRepository, cacheRepo *repository.CacheRepository, telegramBot TelegramBot) *Service {
	return &Service{
		postgresRepo: postgresRepo,
		cacheRepo:    cacheRepo,
		telegramBot:  telegramBot,
	}
}

func (s *Service) GetHiscore(ctx context.Context) ([]models.HiscoreTop, error) {
	return s.postgresRepo.GetHiscores(ctx)
}

func (s *Service) SaveScore(ctx context.Context, user models.User) error {

	err := s.postgresRepo.SaveUserWithScore(ctx, user)
	if err != nil {
		return err
	}

	return nil
}

package repository

import (
	"context"
	"fmt"
	"log"
	"time"
	_ "time/tzdata"

	"github.com/kosmosoid/stackattackbot/internal/logging"

	"github.com/jmoiron/sqlx"
	"github.com/kosmosoid/stackattackbot/internal/models"
	_ "github.com/lib/pq"
)

type PostgresRepository struct {
	db *sqlx.DB
}

func NewPostgresDB(dataSourceName string) (*PostgresRepository, error) {
	const maxAttempts = 10
	const delay = 3 * time.Second

	var db *sqlx.DB
	var err error

	for i := 1; i <= maxAttempts; i++ {
		db, err = sqlx.Connect("postgres", dataSourceName)
		if err == nil {
			log.Printf("DB connected")
			return &PostgresRepository{db: db}, nil
		}

		log.Printf("DB not ready yet (attempt %d/%d): %v", i, maxAttempts, err)
		time.Sleep(delay)
	}

	return nil, fmt.Errorf("failed to connect to DB after %d attempts: %w", maxAttempts, err)
}

func (r *PostgresRepository) GetHiscores(ctx context.Context) ([]models.HiscoreTop, error) {
	var tops []models.HiscoreTop
	err := r.db.SelectContext(ctx, &tops, `
	SELECT 
    username,
    score
	FROM users
	ORDER BY score DESC
	LIMIT 10`)
	return tops, err
}

func (r *PostgresRepository) SaveUserWithScore(ctx context.Context, user models.User) error {
	_, err := r.db.ExecContext(ctx, `
	INSERT INTO users (id, username, first_name, last_name, is_premium, score)
	VALUES  ($1, $2, $3, $4, $5, $6)
	ON CONFLICT (id)
	DO UPDATE SET
	score = GREATEST(users.score, EXCLUDED.score),
	updated_at = now();
	`, user.ID, user.Username, user.FirstName, user.LastName, user.IsPremium, user.Score)
	if err != nil {
		logging.Debug("SaveUserWithScore error: %v", err)
		return err
	}

	return nil
}

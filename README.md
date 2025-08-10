# Super Stack Attack - Telegram Bot Game

A Telegram bot featuring the Super Stack Attack game - an exciting game accessible through Telegram.

## Requirements

- Go 1.19 or higher
- Docker and Docker Compose
- Make
- Node.js and npm (for frontend build)
- PostgreSQL (if running without Docker)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd stackattackgamebot
```

2. Create environment variables file:
```bash
cp .env.example .env
```

3. Edit the `.env` file by adding the required environment variables:
- `TELEGRAM_BOT_TOKEN` - your Telegram bot token
- Other necessary environment variables

4. Launch the project using Docker Compose:
```bash
docker-compose up -d
```

## Development Setup

### 1. Install Dependencies

Install Go dependencies:
```bash
go mod download
```

Install Node.js dependencies:
```bash
npm install
```

### 2. Database Setup

If you're using local PostgreSQL:
```bash
cd dbshell
./db.sh
```

### 3. Build Frontend

```bash
gulp build
```

### 4. Run Application

```bash
make run
```

## Project Structure

- `cmd/` - application entry point
- `internal/` - internal application logic
  - `api/` - HTTP API handlers
  - `models/` - data models
  - `repository/` - database operations
  - `service/` - business logic
  - `telegram/` - Telegram API integration
- `web/` - frontend application
  - `css/` - styles
  - `js/` - JavaScript code
  - `sounds/` - sound effects
  - `images/` - images
  - `templates/` - HTML templates

## Make Commands

- `make` or `make build` - build for current architecture and OS
- `make linux` - build for Linux x86_64
- `make run` - local build and run
- `make clean` - remove built application and frontend
- `make docker` - build and run in docker
- `make docker-rebuild` - rebuild and run in docker
- `make docker-clean` - stop and remove from docker

---

# Super Stack Attack - Telegram Bot Game

Telegram бот с игрой Super Stack Attack - увлекательная игра, доступная через Telegram.

## Требования

- Go 1.19 или выше
- Docker и Docker Compose
- Make
- Node.js и npm (для сборки фронтенда)
- PostgreSQL (если запускаете без Docker)

## Быстрый старт

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd stackattackgamebot
```

2. Создайте файл с переменными окружения:
```bash
cp .env.example .env
```

3. Отредактируйте `.env` файл, добавив необходимые переменные окружения:
- `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота
- Другие необходимые переменные окружения

4. Запустите проект через Docker Compose:
```bash
docker-compose up -d
```

## Запуск для разработки

### 1. Установка зависимостей

Установите Go зависимости:
```bash
go mod download
```

Установите Node.js зависимости:
```bash
npm install
```

### 2. Настройка базы данных

Если вы используете локальную PostgreSQL:
```bash
cd dbshell
./db.sh
```

### 3. Сборка фронтенда

```bash
gulp build
```

### 4. Запуск приложения

```bash
make run
```

## Структура проекта

- `cmd/` - точка входа приложения
- `internal/` - внутренняя логика приложения
  - `api/` - HTTP API handlers
  - `models/` - модели данных
  - `repository/` - работа с базой данных
  - `service/` - бизнес-логика
  - `telegram/` - интеграция с Telegram API
- `web/` - фронтенд приложения
  - `css/` - стили
  - `js/` - JavaScript код
  - `sounds/` - звуковые эффекты
  - `images/` - изображения
  - `templates/` - HTML шаблоны

## Команды Make

- `make` или `make build` - сборка для текущей архитектуры и ОС
- `make linux` - сборка для Linux x86_64
- `make run` - локальная сборка и запуск
- `make clean` - удаление собранного приложения и фронтэнда
- `make docker` - сборка запуск в докере
- `make docker-rebuild` - пересборка и запуск в докере
- `make docker-clean` - останов и удаление из докера
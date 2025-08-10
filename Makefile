build:
	rm -rf stkatkbot ./web/js/bundle*
	go build -ldflags "-X main.AppVersion=`date +%Y%m%d%H%M%S`" -o stkatkbot ./cmd/
	npm run build

run:
	rm -rf stkatkbot ./web/js/bundle*
	go build -ldflags "-X main.AppVersion=`date +%Y%m%d%H%M%S`" -o stkatkbot ./cmd/
	npm run build
	./stkatkbot

linux:
	rm -rf stkatkbot ./web/js/bundle*
	GOOS=linux GOARCH=amd64 go build -ldflags "-X main.AppVersion=`date +%Y%m%d%H%M%S`" -o stkatkbot ./cmd/
	npm run build

clean:
	rm -rf stkatkbot ./web/js/bundle*

docker:
	docker compose build
	docker compose up -d

docker-rebuild:
	docker compose down
	docker compose build
	docker compose up -d

docker-clean:
	docker compose down -v

.PHONY: build
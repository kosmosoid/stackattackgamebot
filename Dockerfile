FROM node:22-alpine AS frontend

WORKDIR /frontend

COPY ./package*.json ./
COPY ./gulpfile.js ./
RUN npm install

COPY ./web/js ./web/js
RUN npm run build

FROM golang:tip-alpine3.22 AS backend

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o app ./cmd/main.go

FROM alpine:3.20

WORKDIR /app

COPY --from=backend /app/app ./

COPY --from=frontend /frontend/web/js/bundle.js ./web/js/bundle.js
COPY ./web/templates ./web/templates
COPY ./web/css ./web/css
COPY ./web/images ./web/images
COPY ./web/sounds ./web/sounds

CMD ["./app"]

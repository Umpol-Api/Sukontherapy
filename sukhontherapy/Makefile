.PHONY: up down logs shell migrate seed build

## Start all containers (build if needed)
up:
	docker compose up --build -d

## Stop and remove containers
down:
	docker compose down

## View app logs
logs:
	docker compose logs -f app

## Open shell in app container
shell:
	docker compose exec app sh

## Run Prisma migrations inside app container
migrate:
	docker compose exec app npx prisma migrate deploy

## Seed the database inside app container
seed:
	docker compose exec app npx prisma db seed

## Build Docker image only
build:
	docker compose build --no-cache app

## Show running containers
ps:
	docker compose ps

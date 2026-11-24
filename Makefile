.PHONY: up down test test-api migrate

up:
	docker compose up

down:
	docker compose down

test:
	docker compose run --rm app bun run test:unit --run

test-api:
	docker compose run --rm api bun test

migrate:
	docker compose run --rm api bun run migration:run

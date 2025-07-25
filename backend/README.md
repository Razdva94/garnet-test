## Команды для миграции

1. npm run typeorm -- migration:generate "src/db/migrations/CreateTable3"
2. npm run build
3. npx typeorm migration:run -d dist/db/data-source-migration.js

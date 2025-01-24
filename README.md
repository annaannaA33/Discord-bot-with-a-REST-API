сначала надо сделать запуск миграций, это создаст таблицы:  tsx src/migrations/runMigrations.ts

для наполнения данных в табилицы:
tsx populateDatabase.ts


проверить базу данных
sqlite3 ./database.sqlite
SELECT * FROM messages;
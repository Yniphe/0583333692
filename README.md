### Конфигурация
> В файле `.env` указать параметры подключения к MongoDB

Доуступные переменные:
- `MONGO_URI` - строка подключения к MongoDB
- `AUTH_SERVER_URI` - endpoint сервера авторизации

* Для корректной работы сервиса необходимо указать endpoint сервера авторизации
## Локальный запуск
* Требуется MongoDB и Node.js

```bash
$ npm install
$ npm run start
```

## Запуск в Docker Compose
* Требуется Docker и Docker Compose

```bash
$ docker-compose up
```


> Сервис будет доступен по адресу `http://127.0.0.1:3001`

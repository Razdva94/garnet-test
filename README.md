# Проект: Тестовое задание. Компания "Garnet"

## Технологии

![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=TypeScript&logoColor=black&labelColor=white)
![Express](https://img.shields.io/badge/express-white?logo=express&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-green?logo=node.js&logoColor=black)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Mui](https://img.shields.io/badge/Mui-blue?logo=Mui&logoColor=blue&labelColor=white)
![Vite](https://img.shields.io/badge/Vite-yellow?logo=Vite&logoColor=yellow&labelColor=white)
![React](https://img.shields.io/badge/-React-61daf8?logo=react&logoColor=black)




## Запуск проекта

Для запуска проекта необходимо выполнить следующие действия:

1. Склонировать проект на ваш компьютер с [Github](https://github.com/Razdva94/garnet) с помощью команды:

```
git clone https://github.com/Razdva94/garnet.git
```

Перейдите в корневые папки проекта (frontend, backend)

2. Установить зависимости:

```
npm i
```

3. В папке backend Отредактируйте файл .env.development и добавьте параметры подключения к базе данных.


4. Сбилдите проект

```
docker-compose build
```

5. Запуститите проект 

```
docker-compose up
```

Фронтенд:

```
http://localhost:8000
```

Бэкенд 

```
http://localhost:3000
```

## Что успел
1. Из звездочек это nest.js, docker

## Потраченное время
1. 8-10 часов, точно не замерял, в спокойном темпе в выходные делал

## Что бы улучшил
Архитектуру, структуру проекта. Можно было бы получше разбить на компоненты на фронте, отдельно вынести логику.
Улучшил бы авторизацию, добавил бы редис для хранения токенов, сейчас рефрешь храниться в бд на каждого пользователя, что не очень хорошо для производительности. Я в целом много времени потратил на аутентификацию, сделал ее не такой простой как в тз, потому что мне это было интересно.


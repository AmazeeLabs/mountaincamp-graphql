# Installation

## Backend

```sh
cd backend
composer install
docker-compose up -d
docker-compose exec --user drupal drupal bash
drush si standard --account-pass=123
```

## Frontend

```sh
cd frontend
yarn install
```

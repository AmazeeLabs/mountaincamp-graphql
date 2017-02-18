# Installation

## Backend

```
cd backend
composer install
docker-compose up -d
docker-compose exec --user drupal drupal bash
drush si standard --account-pass=123
```

## Frontend

```
cd frontend
yarn install
```

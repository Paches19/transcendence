# Transcendence

# Run project


## With docker

```bash
cp .example.env /src/docker/.env

#Give .env values
vim /src/docker/.env 

make
```

## Without docker

Run django server without docker:

```bash
docker run --name some-postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_USER=postgres -e POSTGRES_DB=transcendence_db -p 5432:5432 -d postgres

cd /src/backend

python manage.py makemigrations

python manage.py migrate

python manage.py runserver
```

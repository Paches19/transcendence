# Transcendence

The last project of the 42 common core.

This project is **single page application** that allows users to create accounts, log in, and play a game of pong against other users.

The project is divided into three main parts:

-   **Web Sockets and algorithms**: The game is played in real time from different clients, using **web sockets** to communicate the game state between the clients and the server.

-   **Frontend**: A **vanilla JS** fronted that accts as a **single page application**, requesting the data to the backend and updating the DOM accordingly.

-   **Backend**: A Django server that provides an API for the frontend to interact with using **Django-Ninja** and using **Postgres** as a database. It also manages the game state and the web sockets connections.

This project runs in **Docker**. Using three containers:

-   **Django** (API and backend) 🐍

-   **Postgres** (database) 🗄️

-   **Nginx** (frontend) 🌐

# Team work 💪

This project was a team effort. You can checkout the team members here:

-   **José Luis Utrera**
    -   [Github](https://github.com/jlutrera)
    -   [LinkedIn](https://www.linkedin.com/in/jose-luis-utrera-5860a9297/)
    -   [42 intra](https://profile.intra.42.fr/users/jutrera-)
-   **Adrian Pacheco**
    -   [Github](https://github.com/Paches19)
    -   [LinkedIn](https://www.linkedin.com/in/adri%C3%A1n-pacheco-ter%C3%A1n-2154641b5/)
    -   [42 intra](https://profile.intra.42.fr/users/adpachec)
-   **Alejandro Aparicio**
    -   [Github](https://github.com/magnitopic)
    -   [LinkedIn](https://www.linkedin.com/in/magnitopic/)
    -   [42 intra](https://profile.intra.42.fr/users/alaparic)

# Run project

## With Docker

```bash
cp .example.env src/docker/.env

#Enter values for the variables in the .env file
vim /src/docker/.env

make
```

## Without docker

Run the backend

```bash
cd /src/backend

docker run --name some-postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_USER=postgres -e POSTGRES_DB=transcendence_db -p 5432:5432 -d postgres

export POSTGRES_DB=transcendence_db POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres123

python manage.py migrate

python manage.py runserver
```

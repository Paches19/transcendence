# Transcendence

The last project of the 42 common core.

This project is **single page application** that allows users to create accounts, log in, play a game of pong against other users, participate in tournaments and compare your stats with friends.

The project is divided into three main parts:

-   **Web Sockets and algorithms**: The game is played in real time from different clients, using **web sockets** to communicate the game state between the clients and the server.

-   **Frontend**: A **vanilla JS** fronted that accts as a **single page application**, requesting the data to the backend and updating the DOM accordingly. And using **Bootstrap** for the styling of the page.

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

Using docker you can run the project with the following setup:

```bash
cp .example.env src/docker/.env

#Enter values for the variables in the .env file
vim src/docker/.env

make
```

Once the project is running you can access the web page at [localhost:8080](https://localhost:8080)

# Database schema

In the project database we store the application information in 5 tables:

-   `user`: Stores user information for their login credentials as well as user statistics from matches

-   `match`: Record of all matches played, indicating what users participated, their respective score and if the match was from a tournament

-   `userTournament`: Table that stores what users are participating in a tournament

-   `tournament`: Table that stores the information of the tournaments, indicating the status of the tournament, the number of participants and the date of the tournament

-   `friend`: Table that stores the relationships between users, indicating if they are friends or if they have a pending friend request

![DB schema image](https://github.com/user-attachments/assets/3c13c92b-eb6d-4193-b0cd-51da3e169d31)

# API routes

The documentation for the API, it's routes as well as the schemas each route expects and returns can be found in the `/api/docs` route of the project.

[Link to the API documentation.](https://localhost:8080/api/docs)

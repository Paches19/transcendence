# Transcendence
NAME			=	transcendence

COMPOSE_ROUTE = src/docker/docker-compose.yml

PORT			= 8080

# Colours
RED				=	\033[0;31m
GREEN			=	\033[0;32m
YELLOW			=	\033[0;33m
BLUE			=	\033[0;34m
PURPLE			=	\033[0;35m
CYAN			=	\033[0;36m
WHITE			=	\033[0;37m
RESET			=	\033[0m

# Rules
all:		$(NAME)

$(NAME):	
			@printf "\n$(BLUE)==> $(CYAN)Building Transcendence 🏗️\n\n$(RESET)"
			@echo "Using compose file at $(COMPOSE_ROUTE)"
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --remove-orphans
			@printf "\n$(BLUE)==> $(CYAN)Transcendence is running ✅\n$(RESET)"
			@printf "$(BLUE)==> $(BLUE)Accessible on: \n\t$(YELLOW)https://localhost:443\n$(RESET)"

stop:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) stop
			@printf "\n$(BLUE)==> $(RED)Transcendence stopped 🛑\n$(RESET)"

clean:		stop
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) down
			@printf "\n$(BLUE)==> $(RED)Removed Transcendence 🗑️\n$(RESET)"

fclean:		clean
			@docker rmi postgres_transcendence:latest django_transcendence:latest nginx_transcendence:latest
			@docker network ls | grep transcendence_net && docker network rm transcendence_net || echo "$(YELLOW)Network transcendence_net not found or already removed$(RESET)"
			@printf "\n$(BLUE)==> $(RED)Fully cleaned Transcendence 🗑️\n$(RESET)"

re:			clean
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --build
			@printf "$(BLUE)==> $(CYAN)Transcendence rebuilt 🔄\n$(RESET)"
			@printf "\n$(BLUE)==> $(CYAN)Transcendence is running ✅\n$(RESET)"
			@printf "$(BLUE)==> $(BLUE)Accessible on: \n\t$(YELLOW)https://localhost:443\n$(RESET)"

re-postgres:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build postgres

re-django:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build django

re-nginx:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build nginx

.PHONY:		all stop clean fclean re re-postgres re-django re-nginx

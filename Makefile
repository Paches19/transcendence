# Transcendence
NAME			=	transcendence

COMPOSE_ROUTE = ./docker-compose.yml

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
			@docker compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --remove-orphans
			@printf "\n$(BLUE)==> $(CYAN)Transcendence is running ✅\n$(RESET)"
			@printf "$(BLUE)==> $(BLUE)Accessible on: \n\t$(YELLOW)https://localhost\n$(RESET)"

stop:
			@docker compose -p $(NAME) -f $(COMPOSE_ROUTE) stop
			@printf "\n$(BLUE)==> $(RED)Transcendence stopped 🛑\n$(RESET)"

clean:		stop
			@docker compose -p $(NAME) -f $(COMPOSE_ROUTE) down
			@printf "\n$(BLUE)==> $(RED)Removed Transcendence 🗑️\n$(RESET)"

fclean:		clean
			@docker rmi postgres_transcendence:latest django_transcendence:latest
			@docker network rm transcendence_net
			@printf "\n$(BLUE)==> $(RED)Removed all images 🗑️\n$(RESET)"

re:			clean
			@docker compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --build
			@printf "$(BLUE)==> $(CYAN)Transcendence rebuilt 🔄\n$(RESET)"
			@printf "\n$(BLUE)==> $(CYAN)Transcendence is running ✅\n$(RESET)"
			@printf "$(BLUE)==> $(BLUE)Accessible on: \n\t$(YELLOW)https://localhost\n$(RESET)"

.PHONY:		all stop clean fclean re

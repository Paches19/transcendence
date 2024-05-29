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
			@printf "$(BLUE)==> $(BLUE)Accessible on: \n\t$(YELLOW)http://localhost:$(PORT)\n$(RESET)"
stop:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) stop
			@printf "\n$(BLUE)==> $(RED)Transcendence stopped 🛑\n$(RESET)"

logs:
			docker logs -f	django

clean:		stop
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) down
			@printf "\n$(BLUE)==> $(RED)Removed Transcendence 🗑️\n$(RESET)"

clean-images:
			@IMAGES="$$(docker images -q)"; \
			if [ -n "$$IMAGES" ]; then \
				docker rmi -f $$IMAGES; \
				printf "\n$(BLUE)==> $(RED)Removed all images. 🗑️\n$(RESET)"; \
			else \
				echo "$(YELLOW)No images to remove.$(RESET)"; \
			fi			

clean-containers:
			@CONTAINERS="$$(docker ps -aq)"; \
			if [ -n "$$CONTAINERS" ]; then \
				docker rm -f $$CONTAINERS; \
				printf "\n$(BLUE)==> $(RED)Removed all containers. 🗑️\n$(RESET)"; \
			else \
				echo "$(YELLOW)No containers to remove.$(RESET)"; \
			fi

clean-networks:
			@NETWORKS="$$(docker network ls | grep transcendence_net)"; \
			if [ -n "$$NETWORKS" ]; then \
				docker network rm transcendence_net; \
				printf "\n$(BLUE)==> $(RED)Removed transcendence network. 🗑️\n$(RESET)"; \
			else \
				echo "$(YELLOW)Network transcendence_net not found or already removed.$(RESET)"; \
			fi

fclean:		clean clean-containers clean-images
			@printf "\n$(BLUE)==> $(RED)Fully cleaned Transcendence. 🗑️\n$(RESET)"

re-postgres:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build postgres

re-django:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build django

re-nginx:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build nginx

re:			fclean
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --build
			@printf "$(BLUE)==> $(CYAN)Transcendence rebuilt. 🔄\n$(RESET)"
			@printf "\n$(BLUE)==> $(CYAN)Transcendence is running. ✅\n$(RESET)"
			@printf "$(BLUE)==> $(BLUE)Accessible on: \n\t$(YELLOW)http://localhost:$(PORT)\n$(RESET)"


.PHONY:		all stop clean fclean re

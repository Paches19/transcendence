FROM python:3.11.7

# Instala netcat
RUN 	apt-get update \
	&& 	apt-get install -y ncat

COPY ./backend ./app

COPY ./docker/django/setup.sh /app/setup.sh
RUN chmod +x /app/setup.sh

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt --no-cache-dir

# Instala Redis
RUN 	apt-get update \
    && 	apt-get install -y redis-server \
    && 	apt-get clean \
    && 	rm -rf /var/lib/apt/lists/*

CMD ["/app/setup.sh"]

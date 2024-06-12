FROM python:3.11.7

COPY ./backend ./app

COPY ./docker/django/setup.sh /app/setup.sh
RUN chmod +x /app/setup.sh

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt --no-cache-dir

CMD ["/app/setup.sh"]

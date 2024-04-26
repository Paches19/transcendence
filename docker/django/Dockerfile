FROM python:3.11.7-alpine

ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./backend ./app

COPY ./docker/django/setup.sh /app/setup.sh
RUN chmod +x /app/setup.sh

WORKDIR /app

RUN pip install -r requirements.txt

CMD ["/app/setup.sh"]

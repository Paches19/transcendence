FROM python:3.8

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /usr/src/app/
COPY src /usr/share/app

CMD ["daphne", "-u", "/usr/src/app/daphne.sock", "transcendence.asgi:application"]

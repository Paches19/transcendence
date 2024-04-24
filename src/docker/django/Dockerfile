FROM python:3.11.7-alpine

ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . ./app

RUN chmod +x ./app/setup.sh

WORKDIR ./app/backend

RUN pip install -r requirements.txt


CMD ["../setup.sh"]

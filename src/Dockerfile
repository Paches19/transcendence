FROM python:3.11.7-alpine

COPY . ./app

WORKDIR ./app/backend

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver"]

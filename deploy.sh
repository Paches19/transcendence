#!/bin/bash

# Nombre del contenedor e imagen
CONTAINER_NAME="servidor-nginx-instance"
IMAGE_NAME="servidor-nginx"

echo "Deteniendo y eliminando el contenedor actual..."
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME

echo "Construyendo una nueva imagen de Docker..."
docker build -t $IMAGE_NAME .

echo "Ejecutando el nuevo contenedor..."
docker run --name $CONTAINER_NAME -p 8080:8080 -d $IMAGE_NAME

echo "El contenedor $CONTAINER_NAME se ha desplegado correctamente."

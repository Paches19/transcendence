# Utilizar la imagen oficial de NGINX
FROM nginx:alpine

# Copiar los archivos del proyecto al directorio de NGINX para servirlos
COPY src /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# NGINX arranca automáticamente, no necesitas un CMD

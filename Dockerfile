# Fase única, simplemente sirviendo archivos estáticos con NGINX
FROM nginx:alpine

# Copiar el directorio src y node_modules al contenedor
COPY ./src /usr/share/nginx/html
COPY ./node_modules /usr/share/nginx/html/node_modules

# Exponer puerto 80
EXPOSE 80

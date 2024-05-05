# Fase única, simplemente sirviendo archivos estáticos con NGINX
FROM nginx:alpine

# Copiar el directorio src y node_modules al contenedor
COPY ./src/frontend /usr/share/nginx/html
COPY ./src/docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Instalar Node.js y npm
RUN apk add --update nodejs npm

# Establecer directorio de trabajo y copiar archivos de Node.js
WORKDIR /usr/share/nginx/html

# Limpiar la caché de npm y usar npm ci para instalación limpia
RUN npm ci

CMD ["nginx", "-g", "daemon off;"]

FROM postgres:16.2

# Copia los archivos de configuración
COPY ./docker/postgres/postgresql.conf /etc/postgresql/postgresql.conf
COPY ./docker/postgres/pg_hba.conf /etc/postgresql/pg_hba.conf

# Ejecuta PostgreSQL con la configuración personalizada
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]

FROM postgres:latest

RUN echo "listen_addresses = '*'" >> /postgresql.conf

CMD ["postgres", "-c", "config_file=/postgresql.conf"]
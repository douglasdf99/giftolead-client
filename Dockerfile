# hadolint ignore=DL3026
FROM 315120000506.dkr.ecr.us-east-1.amazonaws.com/hotmart/alpine:latest

USER root

RUN apk --no-cache add \
    nginx=1.18.0-r3

COPY nginx/* /etc/nginx/

# Forward request logs to Docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

COPY . /home/app

# Copy existing application directory contents
RUN chown -R app:app . /home/app

COPY ./start.sh /usr/bin/start.sh

RUN chmod +x /usr/bin/start.sh

WORKDIR /home/app

# Change current user to app
USER app

EXPOSE 8080
CMD ["/usr/bin/start.sh"]
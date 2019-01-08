FROM kyma/docker-nginx
RUN mkdir /dist
COPY dist/ /dist
COPY dist/ /var/www

COPY scripts/start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]
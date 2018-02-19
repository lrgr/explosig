FROM node:8-alpine

# Install nginx
RUN apk add --no-cache nginx
RUN chown -R nginx:www-data /var/lib/nginx
#RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf

RUN npm install -g yarn

RUN mkdir /app_tmp
WORKDIR /app_tmp
# Install npm packages
COPY package.json /app_tmp
COPY yarn.lock /app_tmp
RUN yarn install --production=false

# Run the webpack build
RUN mkdir -p /app_tmp/src
RUN mkdir -p /app_tmp/dist
COPY src /app_tmp/src
COPY .babelrc /app_tmp
COPY webpack.config.js /app_tmp

RUN npm run prod

# Copy dist to www folder
RUN mkdir -p /www
RUN cp -a /app_tmp/dist/. /www
RUN mkdir -p /www/data

# Download /data from signature-computation releases
# Move to /www/data
#TEMP:
RUN mkdir -p /www/data/sigs
COPY sigs /www/data/sigs

# Clean up build tools
RUN rm -rf /app_tmp

COPY /etc/nginx/conf.d /etc/nginx/conf.d
EXPOSE 80 443

RUN mkdir -p /run/nginx
CMD ["nginx", "-g", "daemon off;"]


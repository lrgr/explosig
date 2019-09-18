FROM kyma/docker-nginx

RUN apt-get update && apt-get install -y curl apt-transport-https ca-certificates

# Install node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update && apt-get install -y nodejs

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

RUN mkdir /src
RUN mkdir /public

#COPY src/ /src
COPY public/ /public

COPY ./.env.development /.env.development
COPY ./babel.config.js /babel.config.js
COPY ./package.json /package.json
COPY ./vue.config.js /vue.config.js
COPY ./yarn.lock /yarn.lock

RUN yarn

WORKDIR /
CMD ["/usr/bin/yarn","serve"]
all: install

install:
	npm install -g yarn
	yarn install --production=false
	npm run prod

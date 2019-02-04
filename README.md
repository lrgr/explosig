[![Build Status](https://travis-ci.org/lrgr/explosig.svg?branch=master)](https://travis-ci.org/lrgr/explosig)

# ExploSig

_interactive exploration of mutation signatures in human cancer_

Hosted: [https://explosig.lrgr.io](https://explosig.lrgr.io)

### Docker Setup
We recommend using the docker configuration at [explosig-docker](https://github.com/lrgr/explosig-docker) to run ExploSig and [ExploSig Server](https://github.com/lrgr/explosig-server) locally.

### Docker-less Setup
For development purposes, ExploSig can be run without Docker.

#### Dependencies
- nodejs
- yarn (`npm install -g yarn`)
- `yarn install`

#### Run
[http://localhost:8080](http://localhost:8080)
```
yarn serve
```

### Build
```
bash scripts/build.sh
```

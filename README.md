[![Build Status](https://travis-ci.org/lrgr/mutation-signature-explorer.svg?branch=master)](https://travis-ci.org/lrgr/mutation-signature-explorer)

# interactive Mutation Signature Explorer (iMuSE)

Hosted: [https://imuse.lrgr.io](https://imuse.lrgr.io)

### Docker Setup
We recommend using the docker configuration at [iMuSE-docker](https://github.com/lrgr/imuse-docker) to run iMuSE and iMuSE Server locally.

### Docker-less Setup
For development purposes, iMuSE can be run without Docker.

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
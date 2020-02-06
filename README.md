[![Build Status](https://travis-ci.org/lrgr/explosig.svg?branch=master)](https://travis-ci.org/lrgr/explosig)

# ExploSig

_interactive exploration of mutation signatures in human cancer_

Hosted: [https://explosig.lrgr.io](https://explosig.lrgr.io)

### Docker Setup
We recommend using the docker configuration at [explosig-docker](https://github.com/lrgr/explosig-docker) to run ExploSig and [ExploSig Server](https://github.com/lrgr/explosig-server) locally.

### Build for production
```
yarn build && docker build -f prod.Dockerfile -t lrgr/explosig .
```

### Build for development
```
docker build -f dev.Dockerfile -t lrgr/explosig-dev .
```

#### Develop
After building the containers, run them with [explosig-docker](https://github.com/lrgr/explosig-docker), then open [http://localhost:8000](http://localhost:8000).

## Related tools

- [ExploSig](https://github.com/lrgr/explosig)
- [ExploSig Server](https://github.com/lrgr/explosig-server)
- [ExploSig Docker](https://github.com/lrgr/explosig-docker)
- [ExploSig Connect](https://github.com/lrgr/explosig-connect)
- [ExploSig Data](https://github.com/lrgr/explosig-data)
# Interactive Mutation Signature Visualization

#### Develpment
Download data from [https://github.com/keller-mark/signature-computation/releases](https://github.com/keller-mark/signature-computation/releases) and move into `dist/data` directory.
```
npm install -g yarn
yarn install --production=false
npm run prod
npm run dev
```
Open browser to [http://localhost:8080](http://localhost:8080)


#### Production
```
docker build . -t sigvis
docker run -p 8080:80 sigvis
```
Open browser to [http://localhost:8080](http://localhost:8080)

# Interactive Mutation Visualizations with Mutation Signatures

### Setup
```
git submodule update --init --recursive
git submodule foreach git pull origin master
```

### Dependencies
- backend
  - python
  - `pip install -r requirements.txt`
- frontend
  - node/python
  - yarn (`npm install -g yarn`)
  - `yarn install`

### Run
- backend: [http://localhost:8000](http://localhost:8000)
  ```
  python app.py
  ```
- frontend: [http://localhost:8080](http://localhost:8080)
  ```
  yarn serve
  ```

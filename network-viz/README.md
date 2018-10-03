vurv.co network visualization
===========
[https://vurvco.github.io/network-viz](https://vurvco.github.io/network-viz)
## requirements
- node.js
- npm

## download
download in current directory
```sh
curl -L -o master.zip https://github.com/vurvco/vurvco.github.io/archive/master.zip && unzip master.zip && rm master.zip
```

## setup
install dependencies
```
npm install
```
## development
run the local webpack-dev-server (live-reload and autocompile) at [http://localhost:8080/](http://localhost:8080/)
```
npm start
```
## production
build assets before committing (will push to [https://vurvco.github.io/network-viz](https://vurvco.github.io/network-viz))
```
npm run build 
```
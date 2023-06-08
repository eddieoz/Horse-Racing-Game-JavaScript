# Shitcoin Horse Racing Game (JavaScript)

The game was modified to list the top 100 cryptocurrencies from Coinmarketcap and use the last data found to change the horse behaviour at every turn.

It randomizes the variation (%) of 1h, 24h, 7d, 30d and 60d, and applies to the speed of the horse.

## Pre-requisites:

1. To run this project, you need a Coinmarketcap API key: https://coinmarketcap.com/api/
2. Update `key.json` with your Coinmarketcap key

## Run a race

Open `index.html` on your browser

Based on https://github.com/fkitsantas/Horse-Racing-Game-JavaScript
Original Live / Demo: https://fkitsantas.github.io/Horse-Racing-Game-JavaScript/

### how to use proxy version

1. Install the dependencies Express and Axios.

```
$ yarn install or npm install
```

2. Start the proxy server.

```
yarn start ou npm start
```

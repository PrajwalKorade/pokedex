

## Pokedex App

[![Build Check](https://github.com/PrajwalKorade/pokedex/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/PrajwalKorade/pokedex/actions/workflows/ci-cd.yml)

This is a simple Pokedex app that allows you to search for Pokemon and view their details. The app is built using React and the [PokeAPI](https://pokeapi/).

### Features
- Search for Pokemon by name
- View Pokemon details such as type, abilities, and stats
- All of the data is cached in browser and redis to reduce the number of API calls


### Running the app
1. Clone the repository
2. Create a .env.local in backend with following variables:
  
		PORT=3001
		REDIS_URL=redis://redis:6379
	POKEAPI_URL=https://pokeapi.co/api/v2/pokemon

3. Run `docker-compose up --build` to build and run the app
(if faced issues related to esbuild in frontend please `cd frontend` and `npm i -D esbuild@0.24.0` and then run docker compose again)
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser
5. API is available at [http://localhost:3001](http://localhost:3001)



##### If you want to run this locally for development then: 

 1. Update REDIS_URL to the correct url `redis://localhost:6379`
 2. Update the API url in `frontend/src/App.jsx` and `frontend/src/components/pokemon-cardv2.jsx`



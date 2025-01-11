## Backend API 

### Folder Structure

```
backend/
├── Dockerfile
├── README.md
├── server.js         # Main server file
├── app.js            # Express app
├── package.json
├── package-lock.json
├── .env              # Environment variables
├── controllers/      # Controllers for handling requests
    |── pokemonController.js   # Controller for handling Pokemon requests
├── routes/           # Routes for handling requests
    |── index.js      # Main route file
    |── pokemon.js    # Routes for handling Pokemon requests
├── services/         # Services for handling business logic
    |── pokemonService.js # Service for handling PokeAPI calls
├── utils/            # Utility functions
    |── processResponse.js # Function to process response from PokeAPI 
├── middleware/       # Middleware functions
    |── logger.js     # Middleware for logging everything
    |── error.js      # Middleware for handling errors
├── config/redis.js   # Configuration for Redis
    
```


import { useState } from "react";
import PokemonSearch from "./components/pokemon-search";
import PokemonCard from "./components/pokemon-cardv2";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchPokemon = async (query) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:3000/api/pokemon/${query}`
      );
      const pokemonData = await response.json();

      if (!response.ok) {
        setError(pokemonData.error.message);
        return;
      }
      console.log(pokemonData.data);

      setPokemon(pokemonData.data);
      setDescription(pokemonData.data.description);
    } catch (err) {
      if (err.status === 404) {
        setError("Resource not found. 404");
      } else {
        setError(
          "An error occurred. Please check console for more information. " + err
        );
      }
      console.error(err);
      setPokemon(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-red-500 to-red-600 p-2">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="text-center">
          <h1 className=" text-4xl font-bold text-white"> Pokédex</h1>
        </div>

        <PokemonSearch onSearch={searchPokemon} className="mb-2" />

        {isLoading && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent text-white" />
          </div>
        )}

        {error && (
          <div className="rounded-lg p-2 w-full max-w-md mx-auto overflow-hidden bg-white/95 backdrop-blur-sm text-red-500 font-medium text-center">
            {error}
          </div>
        )}

        {pokemon && !isLoading && (
          <PokemonCard pokemon={pokemon} description={description} />
        )}
      </div>
    </div>
  );
}

export default App;

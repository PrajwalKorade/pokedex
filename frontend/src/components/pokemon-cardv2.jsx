import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Ruler,
  Weight,
  Swords,
  Sparkles,
  BarChart,
  Info,
  RefreshCcw,
} from "lucide-react";

const typeColors = {
  normal: ["#A8A878", "#C6C6A7"],
  fire: ["#F08030", "#F5AC78"],
  water: ["#6890F0", "#9DB7F5"],
  electric: ["#F8D030", "#FAE078"],
  grass: ["#78C850", "#A7DB8D"],
  ice: ["#98D8D8", "#BCE6E6"],
  fighting: ["#C03028", "#D67873"],
  poison: ["#A040A0", "#C183C1"],
  ground: ["#E0C068", "#EBD69D"],
  flying: ["#A890F0", "#C6B7F5"],
  psychic: ["#F85888", "#FA92B2"],
  bug: ["#A8B820", "#C6D16E"],
  rock: ["#B8A038", "#D1C17D"],
  ghost: ["#705898", "#A292BC"],
  dragon: ["#7038F8", "#A27DFA"],
  dark: ["#705848", "#A29288"],
  steel: ["#B8B8D0", "#D1D1E0"],
  fairy: ["#EE99AC", "#F4BDC9"],
};

function PokemonCard({ pokemon, description }) {
  const [currentSprite, setCurrentSprite] = useState("artwork");

  function formatPokemonName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function formatPokemonId(id) {
    return `#${id.toString().padStart(3, "0")}`;
  }

  const mainType = pokemon.types[0];
  const sprites = {
    default: pokemon.sprites.front,
    artwork: pokemon.sprites.official,
    home: pokemon.sprites.back,
  };

  const gradientStyle = {
    background: `linear-gradient(to bottom right, ${typeColors[mainType][0]}, ${typeColors[mainType][1]})`,
  };

  const cycleSprite = () => {
    const spriteOrder = ["artwork", "default", "home"];
    const currentIndex = spriteOrder.indexOf(currentSprite);
    const nextIndex = (currentIndex + 1) % spriteOrder.length;
    setCurrentSprite(spriteOrder[nextIndex]);
  };
  const statIcons = {
    hp: "❤️",
    attack: "⚔️",
    defense: "🛡️",
    "special-attack": "✨",
    "special-defense": "🔮",
    speed: "⚡",
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-white/95 backdrop-blur-sm">
      <div className="relative h-72" style={gradientStyle}>
        <div className="relative h-64 mb-4">
          <div
            key={currentSprite}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={sprites[currentSprite]}
              alt={pokemon.name}
              width={256}
              height={256}
              className="object-contain"
            />
          </div>
          <button
            onClick={cycleSprite}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors duration-200"
          >
            <RefreshCcw className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-2xl font-bold">
              {formatPokemonName(pokemon.name)}
            </h2>
            <span className="text-sm text-gray-500">
              N°{formatPokemonId(pokemon.id)}
            </span>
          </div>
          <div className="flex gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                style={{
                  backgroundColor: typeColors[type][0],
                }}
                className="px-4 py-1 text-sm font-medium text-white rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="moves" className="flex items-center gap-2">
              <Swords className="w-4 h-4" />
              Moves
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-0">
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div key={stat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <span>{statIcons[stat.name]}</span>
                      <span>{stat.name}</span>
                    </span>
                    <span className="font-mono">{stat.value}</span>
                  </div>
                  <Progress value={stat.value} max={255} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="moves" className="mt-0">
            <ScrollArea className="w-full pr-4">
              <div className="grid grid-cols-2 gap-3">
                {pokemon.moves.slice(0, 8).map((move) => (
                  <div
                    key={move}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-violet-100 to-violet-200 shadow-sm"
                  >
                    <span className="text-sm font-medium">{move}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="info" className="mt-0">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-4">
                <h3 className="text-sm text-gray-500 flex items-center justify-center gap-2 mb-2">
                  ABILITIES
                </h3>
                {pokemon.abilities.map((ability) => (
                  <div key={ability} className="space-y-1">
                    <h3 className="font-medium flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {ability}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Ruler className="w-4 h-4" />
                    HEIGHT
                  </div>
                  <div className="font-medium text-lg">{pokemon.height} m</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Weight className="w-4 h-4" />
                    WEIGHT
                  </div>
                  <div className="font-medium text-lg">{pokemon.weight} kg</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}

export default PokemonCard;

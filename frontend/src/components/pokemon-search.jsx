import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

function PokemonSearch({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm =
      selectedIndex >= 0 ? suggestions[selectedIndex] : query.trim();
    if (!searchTerm) return;

    setSuggestions([]);
    setSelectedIndex(-1);
    setQuery(searchTerm);
    onSearch(searchTerm.toLowerCase());
  };

  const debouncedSearch = useRef(
    debounce(async (searchTerm) => {
      if (!searchTerm) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/api/pokemon/suggest?q=${searchTerm}`
        );
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        const data = await response.json();
        setSuggestions(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          setQuery(suggestions[selectedIndex]);
          setSuggestions([]);
          onSearch(suggestions[selectedIndex].toLowerCase());
        }
        break;
      case "Escape":
        setSuggestions([]);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  return (
    <Card className="w-full max-w-md mx-auto p-4 bg-white/95 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search Pokemon..."
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 h-12 text-lg bg-transparent border-2 bg-white border-gray-200 rounded-2xl focus:border-primary focus:ring-primary"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className=" w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <ScrollArea className="max-h-64">
              <div ref={listRef} className="py-1">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    role="option"
                    id={`suggestion-${index}`}
                    aria-selected={index === selectedIndex}
                    onClick={() => {
                      setQuery(suggestion);
                      setSuggestions([]);
                      onSearch(suggestion.toLowerCase());
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`
                      flex items-center gap-2 px-4 py-2 cursor-pointer
                      ${
                        index === selectedIndex
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    {index === selectedIndex && (
                      <div className="flex gap-1 items-center text-xs text-gray-400">
                        <ArrowUpCircle className="w-4 h-4" />
                        <ArrowDownCircle className="w-4 h-4" />
                      </div>
                    )}
                    <span className="flex-1">{suggestion}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </form>

      {/* {query && suggestions.length === 0 && !isLoading && (
        <div className="mt-2 text-sm text-gray-500 text-center">
          No Pokemon found matching "{query}"
        </div>
      )} */}
    </Card>
  );
}

export default PokemonSearch;

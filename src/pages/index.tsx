// src/pages/index.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image'
import { useTheme } from '@storybook/theming'

interface Game {
  id: number;
  name: string;
  released: string;
  background_image: string;
  platforms: Platform[];
}

interface Platform {
  platform: {
    name: string;
  };
}


const Home = () => {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const queryRef = useRef(query);
  queryRef.current = query;

  const cache = useRef(new Map());

  const { theme } = useTheme(); // Use the theme from the context

  const fetchGames = useCallback(async (searchQuery: string, pageNumber: number) => {
    // Check cache first
    const cacheKey = `${searchQuery}-${pageNumber}`;
    const cachedResults = cache.current.get(cacheKey);
    if (cachedResults) {
      setGames(cachedResults);
      return; // Skip fetching
    }
    setLoading(true);
    try {
      const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${searchQuery}&page_size=100&page=${pageNumber}`);
      const data = await response.json();
      // After fetching, cache the results
      cache.current.set(searchQuery, data.results);
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid API response format');
      }
      setGames(prevGames => {
        const newGames = data.results.filter((newGame: Game) => !prevGames.some(game => game.id === newGame.id));
        return [...prevGames, ...newGames];
      });
      setHasMore(data.results.length > 0);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error fetching games:", error);
      setError('Failed to load games. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (queryRef.current && queryRef.current.length >= 3) {
        setGames([]);
        setPage(1);
        setHasMore(true);
        // Async IIFE
        (async () => {
          try {
            await fetchGames(queryRef.current, 1);
            // Handle successful fetch if needed
          } catch (error) {
            console.error(error); // Handle any errors
          }
        })();
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [query, fetchGames]);


  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="search-bar my-4">
          <input
            type="text"
            placeholder="Search for a game..."
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Error Message Display */}
        {error && <div className="my-4 text-center text-red-500">{error}</div>}

        {/* Conditional rendering: if there's no error, show loading or results */}
        {!error && (
          <>
          {loading && <div className="text-center my-4">Loading games...</div>}
            <div className="games-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game, index) => (
                <div
                  key={`${game.id}-${index}`}
                  className="game-item flex flex-col p-4 border border-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  {game.background_image && (
                    <div className="flex-shrink-0 relative w-full mb-2"
                         style={{ paddingTop: '56.25%' }}> {/* This sets an aspect ratio */}
                      <Image
                        src={game.background_image}
                        alt={game.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-lg font-bold">{game.name}</h3>
                    <p className="text-sm">Released: {game.released}</p>
                    <div className="text-sm mt-auto">
                      Platforms: {game.platforms?.length > 0 ? game.platforms.map(p => p.platform.name).join(', ') : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
              {hasMore && (
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => fetchGames(query, page)}
                >
                  Load More
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;

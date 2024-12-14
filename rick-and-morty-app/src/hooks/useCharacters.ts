import { useState, useEffect } from 'react';
import axios from 'axios';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  episode: string[];
}

interface UseCharactersResponse {
  characters: Character[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

export const useCharacters = (page: number, filters: { name: string; status: string; species: string; gender: string }): UseCharactersResponse => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const params: any = {
          page,
          ...filters,
        };

        const response = await axios.get('https://rickandmortyapi.com/api/character', { params });
        setCharacters(response.data.results);
        setTotalPages(response.data.info.pages);
        setLoading(false);
      } catch (err) {
        setError('Veri yüklenemedi');
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [page, filters]);

  return { characters, loading, error, totalPages };
};

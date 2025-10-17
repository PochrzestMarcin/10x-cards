import { useState, useCallback, useEffect } from 'react';
import type { FlashcardViewModel, FlashcardsListQuery, FlashcardSource, PaginatedFlashcardsResponseDTO, PaginationDto } from '@/types';

interface UseFlashcardsReturn {
  flashcards: FlashcardViewModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  setSort: (column: string) => void;
  setSourceFilter: (source: FlashcardSource | null) => void;
  refresh: () => Promise<void>;
}

export function useFlashcards(): UseFlashcardsReturn {
  const [flashcards, setFlashcards] = useState<FlashcardViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState<FlashcardsListQuery>({
    page: 1,
    limit: 10,
    sort: 'created_at',
    order: 'desc'
  });
  
  const [pagination, setPagination] = useState<PaginationDto>({
    page: 1,
    limit: 10,
    total: 0
  });

  
const fetchFlashcards = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    console.log('Fetching flashcards...')
    const queryParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    console.log('Query params:', queryParams.toString());
    const url = `/api/flashcards?${queryParams.toString()}`;
    console.log('URL:', url);
    const response = await fetch(`/api/flashcards?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response);
    if (!response.ok) {
      throw new Error('Failed to fetch flashcards');
    }

    const data: PaginatedFlashcardsResponseDTO = await response.json();
    const viewModels: FlashcardViewModel[] = data.data.map(card => ({
      ...card,
      isEditing: false
    }));

    setFlashcards(viewModels);
    setPagination(data.pagination);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('An error occurred');
    setError(error);
  } finally {
    setIsLoading(false);
  }
}, [query]);


  const setPage = useCallback((page: number) => {
    setQuery(prev => ({ ...prev, page }));
  }, []);

  const setSort = useCallback((column: string) => {
    setQuery(prev => ({
      ...prev,
      sort: column as 'created_at' | 'source',
      order: prev.sort === column && prev.order === 'asc' ? 'desc' : 'asc',
      page: 1 // Reset to first page when sort changes
    }));
  }, []);

  const setSourceFilter = useCallback((source: FlashcardSource | null) => {
    setQuery(prev => ({
      ...prev,
      source: source || undefined,
      page: 1 // Reset to first page when filter changes
    }));
  }, []);

  const refresh = async () => {
    await fetchFlashcards();
  };

  // Initial fetch
  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return {
    flashcards,
    pagination,
    isLoading,
    error,
    setPage,
    setSort,
    setSourceFilter,
    refresh
  };
}

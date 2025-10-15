import { useState, useCallback, useEffect } from 'react';
import type { FlashcardDTO, FlashcardSource, FlashcardViewModel, PaginationDto } from '@/types';

interface UseFlashcardsState {
  flashcards: FlashcardViewModel[];
  pagination: PaginationDto;
  isLoading: boolean;
  error: Error | null;
  sortColumn: string;
  sortOrder: 'asc' | 'desc';
  sourceFilter: FlashcardSource | null;
}

export function useFlashcards() {
  const [state, setState] = useState<UseFlashcardsState>({
    flashcards: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    isLoading: false,
    error: null,
    sortColumn: 'created_at',
    sortOrder: 'desc',
    sourceFilter: null
  });

  const fetchFlashcards = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const queryParams = new URLSearchParams();
      
      setState(prev => {
        queryParams.set('page', prev.pagination.page.toString());
        queryParams.set('limit', prev.pagination.limit.toString());
        queryParams.set('sort', prev.sortColumn);
        queryParams.set('order', prev.sortOrder);
        
        if (prev.sourceFilter) {
          queryParams.set('source', prev.sourceFilter);
        }
        
        return prev;
      });

      const response = await fetch(`/api/flashcards?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }

      const data = await response.json();
      setState(prev => ({
        ...prev,
        flashcards: data.data.map((card: FlashcardDTO) => ({
          ...card,
          isEditing: false
        })),
        pagination: data.pagination,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false
      }));
    }
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page }
    }));
  }, []);

  const setSort = useCallback((column: string) => {
    setState(prev => ({
      ...prev,
      sortColumn: column,
      sortOrder: prev.sortColumn === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const setSourceFilter = useCallback((source: FlashcardSource | null) => {
    setState(prev => ({
      ...prev,
      sourceFilter: source,
      pagination: { ...prev.pagination, page: 1 }
    }));
  }, []);

  const refresh = useCallback(() => {
    return fetchFlashcards();
  }, [fetchFlashcards]);

  // Fetch flashcards when filters or pagination change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFlashcards();
    }, 0);
    return () => clearTimeout(timer);
  }, [
    fetchFlashcards
  ]);

  return {
    flashcards: state.flashcards,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    sourceFilter: state.sourceFilter,
    setPage,
    setSort,
    setSourceFilter,
    refresh
  };
}

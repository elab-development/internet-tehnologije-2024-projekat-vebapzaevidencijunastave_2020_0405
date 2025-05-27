import { useState, useCallback } from 'react';

const usePagination = (initialPage = 1, initialPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  }, [lastPage]);

  const nextPage = useCallback(() => {
    if (currentPage < lastPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, lastPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const updatePaginationData = useCallback(({ current_page, last_page, total }) => {
    setCurrentPage(current_page);
    setLastPage(last_page);
    setTotal(total);
  }, []);

  return {
    currentPage,
    perPage,
    lastPage,
    total,
    goToPage,
    nextPage,
    prevPage,
    updatePaginationData,
    setPerPage
  };
};

export default usePagination; 
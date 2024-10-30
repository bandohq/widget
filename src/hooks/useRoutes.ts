// New useRoutes for UI-only usage
export const useRoutes = () => {
    const routes = [] // Empty array representing no available routes
    const setReviewableRoute = () => {} // Empty function to satisfy hook signature
  
    return {
      routes,
      setReviewableRoute,
      // Other values needed to maintain the original hook structure, here as placeholders:
      isLoading: false,
      isFetching: false,
      isFetched: true,
      dataUpdatedAt: null,
      refetchTime: 0,
      refetch: () => {}, // Empty function
      fromChain: null,
      toChain: null,
      queryKey: [],
    }
  }
  
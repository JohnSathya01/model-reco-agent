import { useState, useCallback } from 'react';
import { generateRecommendation } from '../utils/mockData';
import type { FormData as AppFormData, RecommendationResult } from '../types';

interface UseRecommendationsReturn {
  recommendations: RecommendationResult | null;
  loading: boolean;
  error: string | null;
  generateRecommendations: (formData: AppFormData) => Promise<RecommendationResult | null>;
  clearRecommendations: () => void;
}

export const useRecommendations = (): UseRecommendationsReturn => {
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = useCallback(async (formData: AppFormData): Promise<RecommendationResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = generateRecommendation(formData);
      setRecommendations(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setError(errorMessage);
      console.error('Error generating recommendations:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRecommendations = useCallback(() => {
    setRecommendations(null);
    setError(null);
  }, []);

  return {
    recommendations,
    loading,
    error,
    generateRecommendations,
    clearRecommendations
  };
};
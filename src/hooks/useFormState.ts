import { useState, useCallback } from 'react';
import type { FormData as AppFormData } from '../types';

interface UseFormStateReturn {
  formData: AppFormData | null;
  setFormData: (data: AppFormData) => void;
  clearFormData: () => void;
  isFormComplete: boolean;
}

export const useFormState = (): UseFormStateReturn => {
  const [formData, setFormDataState] = useState<AppFormData | null>(null);

  const setFormData = useCallback((data: AppFormData) => {
    setFormDataState(data);
  }, []);

  const clearFormData = useCallback(() => {
    setFormDataState(null);
  }, []);

  const isFormComplete = Boolean(
    formData?.projectDetails?.useCaseType &&
    formData?.projectDetails?.taskType &&
    formData?.projectDetails?.deploymentPlatform &&
    formData?.dataset?.size &&
    formData?.dataset?.format &&
    formData?.dataset?.labelQuality &&
    (formData?.constraints?.targetAccuracy || formData?.constraints?.accuracyTarget) &&
    formData?.constraints?.budgetLevel
  );

  return {
    formData,
    setFormData,
    clearFormData,
    isFormComplete
  };
};
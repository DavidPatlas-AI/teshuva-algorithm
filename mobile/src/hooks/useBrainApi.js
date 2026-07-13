import {useState, useCallback} from 'react';
import {brainService} from '../services/BrainService';

export function useBrainApi() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const call = useCallback((fn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      return fn(...args);
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const explainText       = useCallback(content => call(brainService.explainText.bind(brainService), content), [call]);
  const getWeeklyInsights = useCallback(() => call(brainService.getWeeklyInsights.bind(brainService)), [call]);
  const positive          = useCallback(categoryId => call(brainService.positive.bind(brainService), categoryId), [call]);
  const negative          = useCallback(categoryId => call(brainService.negative.bind(brainService), categoryId), [call]);

  return {explainText, getWeeklyInsights, positive, negative, loading, error};
}

import {useState, useCallback} from 'react';
import * as brain from '../api/brain';

export function useBrainApi() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const call = useCallback(async (fn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      return result;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const explain          = useCallback(content => call(brain.explain, content), [call]);
  const getWeeklyInsights = useCallback(() => call(brain.getWeeklyInsights), [call]);
  const getMood          = useCallback(() => call(brain.getMood), [call]);
  const sendFeedback     = useCallback((cat, pos) => call(brain.sendFeedback, cat, pos), [call]);
  const getStats         = useCallback(() => call(brain.getStats), [call]);

  return {explain, getWeeklyInsights, getMood, sendFeedback, getStats, loading, error};
}

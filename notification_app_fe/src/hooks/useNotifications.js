import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook to manage notification data fetching, state, and errors.
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch based on type (all, top, placement, result, event)
  const fetchNotifications = useCallback(async (type = 'all') => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '/notifications/all';
      
      if (type === 'top') endpoint = '/notifications';
      else if (['placement', 'result', 'event'].includes(type)) {
        endpoint = `/notifications/type/${type}`;
      }

      const response = await api.get(endpoint);
      
      // Add a 'viewed' state property strictly for frontend tracking
      // In a real app, this would be saved to the database per-user
      const dataWithViewState = response.data.data.map(notif => ({
        ...notif,
        isViewed: false 
      }));

      setNotifications(dataWithViewState);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark a notification as viewed
  const markAsViewed = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id || n._id === id ? { ...n, isViewed: true } : n
    ));
  }, []);

  return { notifications, loading, error, fetchNotifications, markAsViewed };
};

import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  CircularProgress, 
  Alert,
  Paper,
  Pagination
} from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationCard } from '../components/NotificationCard';

export const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { notifications, loading, error, fetchNotifications, markAsViewed } = useNotifications();

  // Fetch data whenever tab changes
  useEffect(() => {
    fetchNotifications(currentTab);
    setPage(1); // Reset page on tab change
  }, [currentTab, fetchNotifications]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination Logic
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedNotifications = notifications.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
        Notification Center
      </Typography>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All" value="all" />
          <Tab label="Top Priority" value="top" />
          <Tab label="Placements" value="placement" />
          <Tab label="Results" value="result" />
          <Tab label="Events" value="event" />
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Box minHeight="50vh">
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        )}

        {!loading && !error && notifications.length === 0 && (
          <Box textAlign="center" mt={5}>
            <Typography variant="h6" color="text.secondary">
              No notifications found for this category.
            </Typography>
          </Box>
        )}

        {/* List of Notifications */}
        {!loading && !error && paginatedNotifications.map((notif, index) => (
          <NotificationCard 
            key={notif.id || notif._id || index} 
            notification={notif} 
            onMarkViewed={markAsViewed}
          />
        ))}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4} mb={2}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Tooltip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDistanceToNow } from 'date-fns';

/**
 * Reusable component to display a single notification.
 */
export const NotificationCard = ({ notification, onMarkViewed }) => {
  const { id, _id, title, message, type, priority, createdAt, isViewed } = notification;
  const notifId = id || _id;

  // Determine styling based on priority/type
  const getStyling = (type) => {
    switch (type?.toLowerCase()) {
      case 'placement':
        return { color: 'error', icon: <BusinessCenterIcon fontSize="small" /> }; // High priority
      case 'result':
        return { color: 'warning', icon: <AssignmentTurnedInIcon fontSize="small" /> }; // Medium
      case 'event':
        return { color: 'info', icon: <EventIcon fontSize="small" /> }; // Low
      default:
        return { color: 'default', icon: <NotificationsIcon fontSize="small" /> };
    }
  };

  const style = getStyling(type);

  return (
    <Card 
      elevation={isViewed ? 1 : 3} 
      sx={{ 
        mb: 2, 
        transition: 'all 0.2s ease-in-out',
        borderLeft: isViewed ? 'none' : '4px solid',
        borderLeftColor: `${style.color}.main`,
        opacity: isViewed ? 0.7 : 1,
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          
          {/* Main Content Area */}
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip 
                icon={style.icon} 
                label={type?.toUpperCase()} 
                size="small" 
                color={style.color} 
                variant={isViewed ? "outlined" : "filled"}
              />
              <Typography variant="caption" color="text.secondary">
                {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'Unknown time'}
              </Typography>
            </Box>
            
            <Typography variant="h6" component="h2" sx={{ fontWeight: isViewed ? 'normal' : 'bold' }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {message}
            </Typography>
          </Box>

          {/* Action Area */}
          <Box ml={2}>
            <Tooltip title={isViewed ? "Marked as viewed" : "Mark as viewed"}>
              <IconButton 
                onClick={() => onMarkViewed(notifId)} 
                color={isViewed ? "default" : "primary"}
                disabled={isViewed}
              >
                {isViewed ? <CheckCircleIcon color="success" /> : <CheckCircleOutlineIcon />}
              </IconButton>
            </Tooltip>
          </Box>

        </Box>
      </CardContent>
    </Card>
  );
};

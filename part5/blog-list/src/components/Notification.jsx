import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Alert, Collapse } from '@mui/material';

const Notification = ({ message, status }) => {
  if (!message) return null;

  const severity = status === 'success' ? 'success' : 'error';
  const icon = status === 'success' ? <CheckCircleIcon /> : <ErrorIcon />;

  return (
    <Collapse in={!!message}>
      <Alert severity={severity} icon={icon} sx={{ mb: 3, borderRadius: 2 }}>
        {message}
      </Alert>
    </Collapse>
  );
};

export default Notification;

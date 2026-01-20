import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUsers } from '../reducers/usersReducer';

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(({ users }) => users.items);
  const loading = useSelector(({ users }) => users.loading);
  const error = useSelector(({ users }) => users.error);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" gutterBottom>
          Error: {error}
        </Typography>
        <Button variant="contained" onClick={() => dispatch(fetchUsers())}>
          Retry
        </Button>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontFamily={700}
          mb={3}
        >
          Users
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {users.map((user) => (
            <Card
              key={user.id}
              component={Link}
              to={`/users/${user.id}`}
              sx={{
                textDecoration: 'none',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={600}
                  >
                    {user.name}
                  </Typography>
                  <Chip
                    label={`${user.blogs?.length || 0} blogs`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight={700}
        mb={3}
      >
        Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight={600}>User</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={600}>Blogs Created</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                sx={{
                  textDecoration: 'none',
                  '&:hover': { backgroundColor: 'action.hover' },
                  cursor: 'pointer',
                }}
              >
                <TableCell>
                  <Typography color="primary.main" fontWeight={500}>
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={user.blogs?.length || 0}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersList;

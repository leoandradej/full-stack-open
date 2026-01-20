import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {
  return (
    <Card
      component={Link}
      to={`/blogs/${blog.id}`}
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
            alignItems: 'start',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              {blog.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {blog.author}
            </Typography>
          </Box>

          <Chip
            icon={<FavoriteIcon sx={{ fontSize: '1rem' }} />}
            label={blog.likes}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Blog;

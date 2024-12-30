import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 4
      }}>
        <Typography variant="h2" component="h1" align="center">
          404 - Page Not Found
        </Typography>
        
        <Typography variant="h5" component="h2" align="center" color="text.secondary">
          The page you're looking for doesn't exist.
        </Typography>

        <Link href="/" passHref>
          <Button variant="contained" size="large">
            Go Home
          </Button>
        </Link>
      </Box>
    </Container>
  );
} 
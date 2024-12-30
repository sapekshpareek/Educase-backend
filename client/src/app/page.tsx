import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';

export default function Home() {
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
          Welcome to Torus Forms
        </Typography>
        
        <Typography variant="h5" component="h2" align="center" color="text.secondary">
          Create, share, and manage forms with ease
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href="/forms/new" passHref>
            <Button variant="contained" size="large">
              Create Form
            </Button>
          </Link>
          
          <Link href="/forms" passHref>
            <Button variant="outlined" size="large">
              View Forms
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
} 
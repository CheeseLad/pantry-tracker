'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Typography } from '@mui/material';
import { auth } from '../../firebase';

const Home = () => {
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h3" gutterBottom>Welcome to Pantry Tracker</Typography>
      <Button color="success" variant="contained" onClick={handleLogin} style={{ margin: '10px' }}>
        Login
      </Button>
      <Button color="success" variant="contained" onClick={handleRegister} style={{ margin: '10px' }}>
        Register
      </Button>
    </Container>
  );
};

export default Home;

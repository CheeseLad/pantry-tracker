'use client';

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase'; // Adjust this import path as necessary
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <html lang="en">
      <body>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pantry Tracker
            </Typography>
            {!user ? (
              <>
                <Link href="/login" passHref>
                  <Button color="success" variant="contained">Login</Button>
                </Link>
                <Box sx={{ mx: 1 }} />
                <Link href="/register" passHref>
                  <Button color="success" variant="contained">Register</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" passHref>
                  <Button color="success" variant="contained">Dashboard</Button>
                </Link>
                <Box sx={{ mx: 1 }} />
                <Button color="success" variant="contained" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Container>
          {children}
        </Container>
      </body>
    </html>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Typography, Box, Paper, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase'; // Make sure to update the path to your firebase.js file
import Pantry from '../components/pantry';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={2}>
    <Box sx={{ mt: 4, pt: 4}}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to your Pantry Tracker: {user.email}
      </Typography>
    

    </Box>
    <Pantry />
    </Stack>
  );
}
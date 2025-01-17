'use client';
import { Box, Typography, Modal, Stack, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { firestore, auth } from '../../../firebase';
import { collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import ReactCamera from './Reactcamera';
import Vision from './Vision';

export default function Pantry() {

  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');


  const updateInventory = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      console.log('User is not authenticated');
      return;
    }
  
    const userId = user.uid;
  
    const inventoryQuery = query(
      collection(firestore, 'inventory'),
      where('userId', '==', userId)
    );
  
    const querySnapshot = await getDocs(inventoryQuery);
    const inventoryList = [];
    
    querySnapshot.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  
    setInventory(inventoryList);
  }

  const addItem = async (item) => {
    const user = auth.currentUser;
  
    if (!user) {
      console.log('User is not authenticated');
      return;
    }
  
    const userId = user.uid;
  
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await updateDoc(docRef, {
        quantity: quantity + 1,
        userId: userId,  // Add the unique user ID here
      });
    } else {
      await setDoc(docRef, {
        quantity: 1,
        userId: userId,  // Add the unique user ID here
      });
    }
  
    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { quantity: quantity - 1, });
      }
    }

    await updateInventory();
  }

  const searchForItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }


  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <main>
      <Box height="100vh" display="flex" justifyContent={"center"} alignItems={"center"} gap={2} flexDirection={"column"} >
        <Modal open={open} onClose={handleClose}>
          <Box position={"absolute"} top={"50%"} left={"50%"} width={400} bgcolor="white" border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)'
          }}>

            <Typography variant='h6'>Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value);
              }}/>
              <Button
              variant='outlined'
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}>Add</Button>

            </Stack>

          </Box>
        </Modal>
        
        <Box border="1px solid #333">
          <Box width="800px" height="100px" bgcolor={"#ADD8E6"} alignItems={"center"} justifyContent={"center"} display={"flex"}  >
            <Typography variant='h3' color={"#333"} padding={"20px"}>Pantry Tracker</Typography>
            <TextField variant='outlined' placeholder='Search' onChange={(e) => {
              const search = e.target.value;
              if (search.length > 0) {
                const results = inventory.filter(({id}) => id.includes(search));
                setInventory(results);
              } else {
                updateInventory();
              }
            }
            } />
            <Box padding={"20px"}>
            <Button variant='contained' onClick={handleOpen} >Add New Item</Button>
            </Box>
          </Box>
          

        <Stack width={"800px"} height={"300px"} spacing={2} overflow={"auto"}>
          {
            inventory.map(({id, quantity}) => (
              <Box key={id} minHeight={"50px"} display={"flex"} alignItems={"center"} justifyContent={"space-between"} bgcolor={"#f0f0f0"} padding={2}>
                <Typography variant='h4' color={"#333"} textAlign={"center"}>{id.charAt(0).toUpperCase() + id.slice(1)}</Typography>
                <Typography variant='h4' color={"#333"} textAlign={"center"}>{quantity}</Typography>
                <Stack direction={"row"} spacing={2}>
                <Button variant='contained' onClick={() => addItem(id)}>+</Button>
                <Button variant='contained' onClick={() => removeItem(id)}>-</Button>
                </Stack>
              </Box>
    ))}
        </Stack>

        </Box>
        <Box width={"800px"} height={"300px"} spacing={2} overflow={"auto"} marginTop={"20px"} border="1px solid #333" padding={"20px"}>
          <Vision />
        </Box>
      </Box>
    </main>
  );
}
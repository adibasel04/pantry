'use client';

import { useState, useEffect } from 'react';
import { Box, Modal, TextField, Typography, Stack, Button } from '@mui/material';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from './firebase'; // Adjust the path based on the actual location of firebase.js

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false); // Set initial state to false
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updatePantry = async () => {
    try {
      const q = query(collection(firestore, 'pantry'));
      const snapshot = await getDocs(q);
      const pantryList = snapshot.docs.map(doc => ({
        name: doc.id,
        ...doc.data(),
      }));
      setPantry(pantryList);
    } catch (error) {
      console.error('Error fetching pantry data:', error);
    }
  };

  const addItem = async (item) => {
    try {
      const itemRef = doc(collection(firestore, 'pantry'), item);
      const itemSnap = await getDoc(itemRef);

      if (itemSnap.exists()) {
        const { quantity } = itemSnap.data();
        await setDoc(itemRef, { quantity: quantity + 1 });
      } else {
        await setDoc(itemRef, { quantity: 1 });
      }
      updatePantry();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItem = async (item) => {
    try {
      const itemRef = doc(collection(firestore, 'pantry'), item);
      const itemSnap = await getDoc(itemRef);

      if (itemSnap.exists()) {
        const { quantity } = itemSnap.data();
        if (quantity === 1) {
          await deleteDoc(itemRef);
        } else {
          await setDoc(itemRef, { quantity: quantity - 1 });
        }
        await updatePantry();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredPantry = pantry.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button variant="outlined" onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant="contained"
        onClick={handleOpen}
      >
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        label="Search Pantry"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredPantry.map(({ name, quantity }) => (
            <Box 
              key={name} 
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant='h3' color='#333' textAlign='center'>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant='h3' color='#333' textAlign='center'>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

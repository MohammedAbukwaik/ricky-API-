const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rick and Morty API base URL
const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/api';

// Routes
app.get('/api/characters', async (req, res) => {
  try {
    const response = await axios.get(`${RICK_AND_MORTY_API}/character`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

app.get('/api/characters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${RICK_AND_MORTY_API}/character/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Character not found' });
  }
});

app.get('/api/characters/search/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(`${RICK_AND_MORTY_API}/character`, {
      params: { name }
    });
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'No characters found' });
  }
});

app.get('/api/characters/filter', async (req, res) => {
  try {
    const { status, species, gender, page } = req.query;
    const params = {};
    
    if (status) params.status = status;
    if (species) params.species = species;
    if (gender) params.gender = gender;
    if (page) params.page = page;
    
    const response = await axios.get(`${RICK_AND_MORTY_API}/character`, {
      params
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter characters' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Ricky API is running!',
    endpoints: {
      characters: '/api/characters',
      characterById: '/api/characters/:id',
      searchByName: '/api/characters/search/:name',
      filter: '/api/characters/filter'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

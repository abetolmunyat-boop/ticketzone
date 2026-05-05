const axios = require('axios');

async function triggerSeed() {
  try {
    const response = await axios.post('http://localhost:5000/api/events/seed');
    console.log('Success:', response.data);
  } catch (err) {
    if (err.response) {
      console.error('Error Status:', err.response.status);
      console.error('Error Data:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

triggerSeed();

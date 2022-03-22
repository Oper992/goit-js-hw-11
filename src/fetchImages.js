const axios = require('axios');

export async function fetchImages(name) {
  const parameters = new URLSearchParams({
    key: '26236897-1332e9e9dbdbc4080cdf2cc84',
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
  });

  try {
    const response = await axios.get(`https://pixabay.com/api/?${parameters}`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

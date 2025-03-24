import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://tobi-backend-zn6z.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
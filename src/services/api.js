// src/services/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // נתעדכן כשנחבר לישראל
});

// נשתמש בעתיד לבקשות לשרת
export default API;

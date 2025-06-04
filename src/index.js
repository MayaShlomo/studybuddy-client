import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// jQuery - דרישה 25
import $ from 'jquery';
// D3.js for charts - דרישה 29
import * as d3 from 'd3';
// Socket.io client - דרישה 28
import { io } from 'socket.io-client';

// Make jQuery available globally
window.jQuery = window.$ = $;
window.d3 = d3;

// Socket.io connection setup
window.socket = io('http://localhost:3000', {
  autoConnect: false // Will connect when user logs in
});

// jQuery Ajax default settings
$.ajaxSetup({
  contentType: 'application/json',
  headers: {
    'Authorization': function() {
      const token = localStorage.getItem('token');
      return token ? `Bearer ${token}` : '';
    }
  },
  error: function(xhr, status, error) {
    console.error('Ajax Error:', status, error);
    if (xhr.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
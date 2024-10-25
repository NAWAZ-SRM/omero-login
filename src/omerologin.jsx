import React, { useState } from 'react';
import axios from 'axios';

const OmeroLoginWithCSRFAndCookies = () => {
  const [serverId, setServerId] = useState('');  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serverUrl, setServerUrl] = useState('');  
  const [csrfToken, setCsrfToken] = useState('');  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/v0/token/`, {
        withCredentials: true, 
      });

      const csrfTokenFromResponse = response.headers['x-csrf-token'] || response.data.csrfToken;
      setCsrfToken(csrfTokenFromResponse);
      console.log('Cookies from server:', document.cookie);
    } catch (error) {
      setError('Failed to fetch CSRF token. Please check the server URL.');
    }
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${serverUrl}/api/v0/token/`,
        {
          server: serverId,          
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,  
          },
          withCredentials: true,
        }
      );

      setSuccess(true);
      setError('');
    } catch (error) {
      setError('Login failed. Check your credentials, server URL, or CSRF token.');
    }
  };

  return (
    <div>
      <h2>Login to OMERO with CSRF Protection and Cookies</h2>

      
      <button onClick={fetchCsrfToken}>Fetch CSRF Token</button>

      {csrfToken && <p>CSRF Token: {csrfToken}</p>}

      
      <form onSubmit={handleLogin}>
        <div>
          <label>Server URL: </label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Server ID: </label>  
          <input
            type="text"
            value={serverId}
            onChange={(e) => setServerId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Login successful!</p>}
    </div>
  );
};

export default OmeroLoginWithCSRFAndCookies;

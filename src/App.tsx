import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The naive fetch: fires immediately on every keystroke
  useEffect(() => {
    if (!searchTerm) {
      setData(null);
      return;
    }

    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${searchTerm}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Search Users (Naive Fetch)</h2>
      
      <input
        type="text"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', fontSize: '1rem', marginBottom: '1rem' }}
      />
      
      <div style={{ minHeight: '100px' }}>
        {loading && <p style={{ color: 'blue' }}>Fetching data...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        {!loading && !error && data && data.length === 0 && (
          <p>No users found matching "{searchTerm}"</p>
        )}
        
        {!loading && !error && data && data.length > 0 && (
          <ul style={{ paddingLeft: '1.5rem' }}>
            {data.map((user) => (
              <li key={user.id} style={{ marginBottom: '0.5rem' }}>{user.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
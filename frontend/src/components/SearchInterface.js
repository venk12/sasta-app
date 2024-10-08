import React, { useState, useContext} from 'react';
import { AppContext } from '../context/AppContext';

const SearchInterface = () => {
  const { darkMode } = useContext(AppContext);
  const [productName, setProductName] = useState('');
  const [responseData, setResponseData] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { product_name: productName, quantity: "1kg" };

    try {
      const response = await fetch('http://127.0.0.1:8000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`flex flex-col justify-center items-center h-screen ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
      <form onSubmit={handleSubmit} className="mb-4"> 
        <input 
          type="text" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
          placeholder="Enter product name" 
          className="p-2 text-black"  // Added text-black for visibility
        />
        <button type="submit" className="p-2">Search</button>
      </form>
      <div>
        {responseData && (
          <table>
            <thead>
              <tr>
                {Object.keys(responseData[0] || {}).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responseData.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SearchInterface;

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faPlugCircleCheck, faPlugCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header = ({isSocketConnected}) => {
  const { darkMode, toggleDarkMode} = useAppContext();
  const location = useLocation();
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isActive = (path) => location.pathname === path;

  const connect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/connect');
      if (response.ok) {
        const data = await response.json();
        console.log('Connect response:', data);
        setIsDeviceConnected(true);
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/disconnect');
      if (response.ok) {
        const data = await response.json();
        console.log('Disconnect response:', data);
        setIsDeviceConnected(false);
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevice = async () => {
    if (isDeviceConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  return (
    <header className={`flex items-center justify-between p-4 fixed top-0 left-0 right-0 ${darkMode ? 'bg-zinc-900' : 'bg-white'} z-50 shadow-md`}>
      <div className="logo">
        {/* Placeholder for logo */}
        {/* <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Logo</span> */}
      </div>
      <nav>
        <ul className="flex gap-8 list-none">
          {/* <li>
            <Link 
              to="/dashboard" 
              className={`${isActive('/dashboard') ? 'font-bold text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Dashboard
            </Link>
          </li> */}
          <li>
            <Link 
              to="/chat" 
              className={`${isActive('/chat') ? 'font-bold text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Chat Interface
            </Link> 
          </li>
          <li>
            <span className='text-md'>Server Status: </span>  
            <span className={`text-md ${isSocketConnected ? 'text-green-500' : 'text-red-500'}`}>
            {isSocketConnected ? 'Connected' : 'Not Connected'}
            </span>
          </li>
          {/* <li>
            <span className='text-sm'>Device Status: </span>  
            <span className={`text-sm ${isDeviceConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isDeviceConnected ? 'Connected' : 'Not Connected'}</span>
            <button
              className={`px-5 mx-2 text-white rounded-full shadow-md transition-colors duration-200 ${
                isDeviceConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
              title={isDeviceConnected ? "Disconnect from Device" : "Connect to Device"}
              onClick={handleDevice}
              disabled={isLoading}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin size="xs" />
              ) : (
                <FontAwesomeIcon icon={isDeviceConnected ? faPlugCircleXmark : faPlugCircleCheck} size="xs" />
              )}
            </button>
          </li> */}
        </ul>
      </nav>
      <button
        onClick={toggleDarkMode}
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
      >
        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
      </button>
    </header>
  );
};

export default Header;

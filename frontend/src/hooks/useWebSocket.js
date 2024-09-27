import { useState, useEffect, useCallback } from 'react';
import { AIMessage, HelperComprehensionMessage, HelperFormationMessage, HouseKeeperMessage } from '../components/MessageTypes/MessageClasses';
import { useAppContext } from '../context/AppContext';

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { addMessage } = useAppContext();

  useEffect(() => {
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setIsSocketConnected(true);
      
      // Send initiation message
      newSocket.send(JSON.stringify({ key: 'initiate', value: '' }));
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsSocketConnected(false);
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(JSON.stringify(data, null, 2));
        
        if (data.key) {
          switch (data.key) {
            case 'housekeeper':
              if(data.value){
                const housekeeper_message = new HouseKeeperMessage(data.value);
                addMessage(housekeeper_message)
              }
              break
            case 'chat':
              if (data.value) {
                const ai_message = new AIMessage(data.value);
                addMessage(ai_message);
              }
              break;
            case 'helper_comprehension':
              if (data.value) {
                const helper_message = new HelperComprehensionMessage(data.value);
                addMessage(helper_message);
              }
              break;
            case 'helper_formation':
              if (data.value) {
                const helper_message = new HelperFormationMessage(data.value);
                addMessage(helper_message);
              }
              break;
            case 'engagement_index':
              if (data.value) {
                console.log(`Engagement: ${data.value}`);
              }
              break;

            case 'workload_index':
              if (data.value) {
                console.log(`Workload: ${data.value}`)
              }
              break

            case 'session_id':
              console.log(data.value)
              break;

            default:
              console.log(`Unknown key: ${data.key}`);
          }
        } 
        else if (data.value !== undefined) {
          console.log('Handling message with value only:', data.value);
          // setValue(data.value);
        } 
        else {
          console.log('Invalid message format:', data);
        }
      } 
      catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url]);

  const sendSocketMessage = useCallback((message) => {
    if (socket && isSocketConnected) {
      socket.send(message);
    }
  }, [socket, isSocketConnected]);

  return { isSocketConnected, sendSocketMessage };
};

export default useWebSocket;
import React, {useState, useEffect, useContext} from 'react';
import { IndicesTrendPlots } from './IndicesTrendPlots';
import { AppContext } from '../context/AppContext';

const DashboardInterface = () => {
  const [plotData, setPlotData] = useState(null);
  const { darkMode } = useContext(AppContext);

  useEffect(() => {
    fetch_indices_trend();
    const intervalId = setInterval(fetch_indices_trend, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const fetch_indices_trend = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/indices_trend');
      if (response.ok) {
        const data = await response.json();
        if (data.key === 'indices_trend') {
          console.log(data)
          setPlotData(JSON.parse(data.value));
        } else {
          console.error('Invalid response format:', data)
        }
      } else {
        console.log("Connection Error")
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  return (
    <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
      <div className={`pt-20 w-1/2 px-2 h-full rounded-lg overflow-hidden flex flex-col ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
        {/* <h1 className='text-white text-left'>Indices Trend</h1> */}
        { plotData?(
            <IndicesTrendPlots data={plotData} />
          ):(<span>Please start the server and connect the headset</span>)
        }
      </div>
    </div>
  );
};

export default DashboardInterface;
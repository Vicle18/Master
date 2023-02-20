import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chip from '@mui/material/Chip';
interface IApiDataProps {
  url: string;
  refreshInterval?: number;
}

const ApiData: React.FC<IApiDataProps> = ({ url, refreshInterval = 1000 }) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);        
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, refreshInterval);

    return () => clearInterval(intervalId);
  }, [url, refreshInterval]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && data && (
        <div>
            <Chip label={JSON.stringify(data, null, 2)} color="success" />
        </div>
      )}
    </div>
  );
};

export default ApiData;
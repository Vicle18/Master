import React, { FC, useState } from 'react';
import CustomizedTreeView from '../../components/IngressOverviewTree';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Unstable_Grid2';
import DetailedView from '../../components/IngressDetailed';
import Chart from '../../components/DataChart';
import IngressOverview from '../../components/IngressOverview';
interface OverviewProps {
  title: string;
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(50),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const Overview: FC<OverviewProps> = ({ title }) => {
  const [selectedItemData, setSelectedItemData] = useState(null);

  const handleItemClick = (data: any) => {
    console.log('data at parent', data);
    
    setSelectedItemData(data);
  };

  return (
    <>
      <Box sx={{ flexGrow: 6, height: '90vh' }}>
      <Grid2 container spacing={2} sx={{ height: '100%' }}>
        <Grid2 xs={2} sx={{ 
          marginTop: '30px', 
          marginLeft: '20px', 
          marginRight: '20px',
          borderRadius: '10px', 
          backgroundColor: 'whitesmoke'  }}>
            <IngressOverview onItemClick={handleItemClick}/>
        </Grid2>
        <Grid2 xs={5.2} sx={{ 
          marginTop: '30px', 
          marginRight: '20px',
          borderRadius: '10px', 

          backgroundColor: 'whitesmoke'  }}>
          <DetailedView containingEntityId={selectedItemData}/>
        </Grid2>
        <Grid2 xs sx={{ 
          marginTop: '30px', 
          marginRight: '50px', 
          borderRadius: '10px', 
          backgroundColor: 'whitesmoke'   }}>
            <Chart url="http://localhost:5001/data" refreshInterval={10000} />
        </Grid2>
      </Grid2>
    </Box>
    </>
  );
};

export default Overview;
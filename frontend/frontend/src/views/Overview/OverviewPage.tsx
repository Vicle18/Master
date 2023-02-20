import React, { FC, useState } from 'react';
import TopBar from '../../components/Overview/Topbar';

import CustomizedTreeView from '../../components/IngressOverview';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Unstable_Grid2';
import DetailedView from '../../components/IngressDetailed';
import Chart from '../../components/DataChart';
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
      <TopBar></TopBar>
      <h1>{title}</h1>
      <Box sx={{ flexGrow: 6 }}>
      <Grid2 container spacing={2}>
        <Grid2 xs={3}>
          <CustomizedTreeView onItemClick={handleItemClick} />
        </Grid2>
        <Grid2 xs={5.5}>
          <DetailedView containingEntityId={selectedItemData}/>
        </Grid2>
        <Grid2 xs={3.5}>
            <Chart url="http://localhost:5001/data" refreshInterval={1000} />
        </Grid2>
      </Grid2>
    </Box>
      
    </>
  );
};

export default Overview;
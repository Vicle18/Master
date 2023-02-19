import React, { FC } from 'react';
import CustomizedTreeView from '../../components/IngressOverview';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Unstable_Grid2';
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
  return (
    <>
      <Box sx={{ flexGrow: 6 }}>
      <Grid2 container spacing={2}>
        <Grid2 xs={3}>
          <CustomizedTreeView />
        </Grid2>
        <Grid2 xs={5.5}>
          <Item>xs=4</Item>
        </Grid2>
        <Grid2 xs={3.5}>
          <Item>xs=4</Item>
        </Grid2>
      </Grid2>
    </Box>
      
    </>
  );
};

export default Overview;
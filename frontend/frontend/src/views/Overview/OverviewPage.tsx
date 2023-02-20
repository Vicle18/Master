import React, { FC } from 'react';
import TopBar from '../../components/Overview/Topbar';

interface OverviewProps {
  title: string;
}

const Overview: FC<OverviewProps> = ({ title }) => {
  return (
    <>
      <TopBar></TopBar>
      <h1>{title}</h1>
    </>
  );
};

export default Overview;
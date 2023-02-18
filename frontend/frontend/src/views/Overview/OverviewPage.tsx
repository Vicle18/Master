import React, { FC } from 'react';

interface OverviewProps {
  title: string;
}

const Overview: FC<OverviewProps> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default Overview;
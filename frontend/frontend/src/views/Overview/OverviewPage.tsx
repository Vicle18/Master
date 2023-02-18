import React, { FC } from 'react';
import { Properties } from '../Properties';

interface OverviewProps {
  title: string;
}

const Overview: FC<Properties> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default Overview;
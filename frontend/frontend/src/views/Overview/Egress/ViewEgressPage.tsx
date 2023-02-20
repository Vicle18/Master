import React, { FC } from 'react';

interface IntegrateProps {
  title: string;
}

const ViewEgressPage: FC<IntegrateProps> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default ViewEgressPage;
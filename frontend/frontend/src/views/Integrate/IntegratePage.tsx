import React, { FC } from 'react';

interface IntegrateProps {
  title: string;
}

const Integrate: FC<IntegrateProps> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default Integrate;
import React, { FC } from 'react';
import { Properties } from '../Properties';

interface IntegrateProps {
  title: string;
}

const Integrate: FC<Properties> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default Integrate;
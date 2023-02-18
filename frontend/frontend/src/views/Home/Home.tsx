import React, { FC } from 'react';
import { Properties } from '../Properties';

interface HomeProps {
  title: string;
}

const Home: FC<Properties> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default Home;
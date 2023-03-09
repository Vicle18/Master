import React, { FC } from 'react';

interface HomeProps {
  title: string;
}

const Home: FC<HomeProps> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default Home;
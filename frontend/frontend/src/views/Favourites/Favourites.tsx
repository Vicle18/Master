import React, { FC } from 'react';
import { Properties } from '../Properties';

interface FavouritesProps {
  title: string;
}

const Favourites: FC<Properties> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default Favourites;
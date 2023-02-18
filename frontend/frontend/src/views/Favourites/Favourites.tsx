import React, { FC } from 'react';

interface FavouritesProps {
  title: string;
}

const Favourites: FC<FavouritesProps> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default Favourites;
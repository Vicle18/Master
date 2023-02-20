import React, { FC } from 'react';

interface IntegrateProps {
  title: string;
}

const CreateIngress: FC<IntegrateProps> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

export default CreateIngress;
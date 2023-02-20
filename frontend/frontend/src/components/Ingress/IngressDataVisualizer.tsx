import * as React from "react";
import { gql, useQuery } from "@apollo/client";
import SearchBar from "./IngressOverviewSearch";
import CustomizedTreeView from './IngressOverviewTree';
import { useState } from "react";

type Props = {
  onItemClick: (data: any) => void;
};

const IngressDataVisualizer: React.FC<Props> = ({ onItemClick }) => {
  const [searchString, setSearchString] = useState('');

  function onSearchResultSelection(searchString: string) {
    setSearchString(searchString);
  }


  return (
    <>
      {/* <SearchBar suggestions={extractNames(data)} onSearch={onSearchResultSelection}/>
      <CustomizedTreeView onItemClick={onItemClick} searchString={searchString} data={data}/> */}
    </>
  );
};

export default IngressDataVisualizer;

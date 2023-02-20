import * as React from "react";
import { gql, useQuery } from "@apollo/client";
import SearchBar from "./IngressOverviewSearch";
import CustomizedTreeView from './IngressOverviewTree';
import { useState } from "react";

interface IngressOverviewProps {
    onItemClick: (data: any) => void;
    }

const IngressOverview: React.FC<IngressOverviewProps> = ({ onItemClick }) => {
    const [searchString, setSearchString] = useState('');
  
  
    const { loading, error, data } = useQuery(GET_LOCATIONS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
  
  
    function onSearchResultSelection(searchString: string) {
      setSearchString(searchString);
    }
  
  
    return (
      <>
        <SearchBar suggestions={extractNames(data)} onSearch={onSearchResultSelection}/>
        <CustomizedTreeView onItemClick={onItemClick} searchString={searchString} data={data}/>
      </>
    );
  };
  
  export default IngressOverview;
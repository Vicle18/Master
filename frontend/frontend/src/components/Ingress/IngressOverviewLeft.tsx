import * as React from "react";
import { gql, useQuery } from "@apollo/client";
import SearchBar from "./IngressOverviewSearch";
import CustomizedTreeView from './IngressOverviewTree';
import { useState } from "react";

type Props = {
  onItemClick: (data: any) => void;
  selectedNode?: string;
  filter?: string[]
};

const GET_LOCATIONS = gql`
  query GetAreas {
    companies {
      id
      name
      plants {
        id
        name
        areas {
          id
          name
          lines {
            id
            name
            cells {
              id
              name
              machines {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

interface TreeNode {
  id: string;
  name: string;
  [key: string]: any;
}

function extractNames(nodes: TreeNode[]) {
  const names: string[] = [];
  const traverse = (node: TreeNode) => {
    names.push(node.name);
    const childrenKey = findChildrenKey(node);
    if (childrenKey && Array.isArray(node[childrenKey])) {
      node[childrenKey]?.forEach((child: TreeNode) => {
        traverse(child);
      });
    }
  };
  if (Array.isArray(nodes)) {
    nodes.forEach((node) => {
      traverse(node);
    });
  } else {
    //console.log("Error: nodes argument is not an array.");
  }
  return names;
}
const findChildrenKey = (node: TreeNode): string | undefined => {
  const keys = Object.keys(node);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Array.isArray(node[key]) && node[key].length > 0) {
      return key;
    }
  }
  return undefined;
};


const IngressOverviewLeft: React.FC<Props> = ({ onItemClick, selectedNode, filter}) => {
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
      <CustomizedTreeView onItemClick={onItemClick} searchString={searchString} data={data} filter={filter ?? ["companies", "plants", "areas", "lines", "cells", "machines"]}/>
    </>
  );
};

export default IngressOverviewLeft;

import { gql, useQuery } from "@apollo/client";
import {
  Autocomplete,
  AutocompleteInputChangeReason,
  AutocompleteRenderInputParams,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const GET_LOCATIONS = gql`
query Machines {
  egressEndpoints {
    id
    name
  }
}
`;
interface Node {
  name: string;
  [key: string]: any;
}
function extractNames(nodes: Node[]) {
  const names: string[] = [];
  const traverse = (node: Node) => {
    names.push(node.name);
    const childrenKey = findChildrenKey(node);
    if (childrenKey && Array.isArray(node[childrenKey])) {
      node[childrenKey]?.forEach((child: Node) => {
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
const findChildrenKey = (node: Node): string | undefined => {
  const keys = Object.keys(node);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Array.isArray(node[key]) && node[key].length > 0) {
      return key;
    }
  }
  return undefined;
};

const EgressSearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState<string>("");

  const { loading, error, data } = useQuery(GET_LOCATIONS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const options = extractNames(data.companies);
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value) {
      console.log(value);

      onSearch(value);
      setSearchTerm(value);
      onSearch(value);
    }
  };

  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setValue(value);
  };

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      margin="normal"
      variant="outlined"
      fullWidth
      size="small"
    />
  );

  return (
    <form onSubmit={handleSearch}>
      <Autocomplete
        freeSolo
        disableClearable
        options={options}
        renderInput={renderInput}
        value={value}
        size="small"
        onChange={(event, newValue) => {
          setValue(newValue);
          onSearch(newValue ?? "");
        }}
        onInputChange={handleInputChange}
      />
    </form>
  );
};

export default EgressSearchBar;

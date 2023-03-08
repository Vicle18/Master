import { Autocomplete, Box, Button, Chip, TextField } from "@mui/material";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";

interface SearchBarProps {

    onApply: (selected: string[]) => void;
}
const GET_LOCATIONS = gql`
  query GetAreas {
    companies {
      name
      plants {
        name
        areas {
          name
          lines {
            name
            cells {
              name
              machines {
                name
              }
            }
          }
        }
      }
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


const EgressSearchIngress: React.FC<SearchBarProps> = ({ onApply }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
  const { loading, error, data } = useQuery(GET_LOCATIONS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const options = extractNames(data.companies);
  

  const handleAdd = () => {
    setSelected((prevSelected) => [...prevSelected, searchValue]);
    setSearchValue('');
  };

  const handleDelete = (chipToDelete: string) => {
    setSelected((prevSelected) =>
      prevSelected.filter((value) => value !== chipToDelete)
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply(selected);
  };

  return (
    <form onSubmit={handleSubmit}>
      
        <Autocomplete
          options={options}
          value={searchValue}
          onChange={(event, newValue) => {
            setSearchValue(newValue ?? '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              margin="normal"
              variant="outlined"
            />
          )}
        />
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      
      <Box mt={2}>
        {selected.map((value) => (
          <Chip
            key={value}
            label={value}
            onDelete={() => handleDelete(value)}
            color="primary"
            variant="outlined"
            style={{ marginRight: '5px', marginBottom: '5px' }}
          />
        ))}
      </Box>
      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
          Apply
        </Button>
      </Box>
    </form>
  );
};

export default EgressSearchIngress;
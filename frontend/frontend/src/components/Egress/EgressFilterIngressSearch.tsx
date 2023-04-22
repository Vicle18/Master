import { Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, TextField } from "@mui/material";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Grid2 from "@mui/material/Unstable_Grid2";
import DetailedView from "../Ingress/IngressDetailed";
import IngressOverviewLeft from "../Ingress/IngressOverviewLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import SensorsIcon from "@mui/icons-material/Sensors";
import { ingressNode } from "./create/FormDefinition";
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
    const [selected, setSelected] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [openPopup, setOpenPopup] = useState(false);
    const [ingressNodes, setIngressNodes] = useState<ingressNode[]>([]);
    const [selectedEgress, setSelectedEgress] =
    useState<string>("");
  const { loading, error, data } = useQuery(GET_LOCATIONS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const options = extractNames(data.companies);
  

  const handleAdd = () => {
    setSelected((prevSelected) => [...prevSelected, searchValue]);
  };

  const handleOpenPopup = () => {
    setIngressNodes(ingressNodes.filter((node) => selected.includes(node.name)));
    setOpenPopup(true);
  }

  const handleDelete = (chipToDelete: string) => {
    console.log("chipToDelete", chipToDelete)
    setSelected((prevSelected) =>
      prevSelected.filter((value) => value.id !== chipToDelete)
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply(selected.map((value) => value.id));
  };

  const handlerClose = () => {
    setOpenPopup(false);
  };

  const handleAddIngressNodes = () => {
    console.log("Ingress nodes", ingressNodes);
    ingressNodes.forEach((node) => {
      console.log("node", node);
      setSelected((prevSelected) => [...prevSelected, node]);
    });
    setOpenPopup(false);
  };

  function handleEgressClick(data: any): void {
    console.log("data", data);
    setSelectedEgress(data.name);
  }

  const handleDeleteIngressFilterNode = (element: ingressNode) => {
    setIngressNodes(ingressNodes.filter((node) => node.id !== element.id));
  };

  const handleSelectObservableProperty = (observableProperty: any) => {
    console.log("observable property", observableProperty);
    //setSelectedIngressNode(observableProperty);
    setIngressNodes([...ingressNodes, observableProperty]);
  };

  return (
    <form onSubmit={handleSubmit}>
        {/* vertical gap */}
        <Box sx={{ height: 20 }} />
        <Button variant="contained" color="primary" onClick={handleOpenPopup}>
          Add
        </Button>
      
      <Box mt={2}>
        {selected.length === 0 && (
          <p style={{ color: 'grey' }}>No filter selected</p>
        )}
        {selected.map((value) => (
          <Chip
            key={value.name}
            label={value.name}
            onDelete={() => handleDelete(value.id)}
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
      <Dialog
        open={openPopup}
        onClose={handlerClose}
        scroll={"paper"}
        fullWidth={true}
        maxWidth={"lg"}
        sx={
          {
            // width: "80vw",
            //height: "80vh",
          }
        }
      >
        <DialogTitle>Add filter for Observable Property</DialogTitle>
        <DialogContent
                dividers={true}
                sx={{ overflow: "auto", maxHeight: "calc(100vh - 250px)" }}
              >
                <>
                    <Grid2 container spacing={2} sx={{ height: "60vh" }}>
                      
                      <Grid2
                        xs={3.6}
                        sx={{
                          marginTop: "30px",
                          marginRight: "20px",
                          borderRadius: "10px",

                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <IngressOverviewLeft onItemClick={handleEgressClick} />
                      </Grid2>
                      <Grid2
                        xs={4.3}
                        sx={{
                          marginTop: "30px",
                          marginRight: "50px",
                          borderRadius: "10px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <DetailedView
                          containingEntityId={selectedEgress}
                          onOpenChart={handleSelectObservableProperty}
                          withDetails={false}
                        />
                      </Grid2>
                      <Grid2
                        xs={2.5}
                        sx={{
                          marginTop: "30px",
                          marginLeft: "20px",
                          marginRight: "20px",
                          borderRadius: "10px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <List
                          dense={true}
                          sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                          }}
                          subheader={
                            <ListSubheader>Observable Properties</ListSubheader>
                          }
                        >
                          {ingressNodes.map((node) => (
                            <ListItemButton
                              key={node.name}
                              sx={{
                                "&:hover": { backgroundColor: "#f0f0f0" },
                              }}
                            >
                              <ListItemIcon>
                                <SensorsIcon />
                              </ListItemIcon>
                              <ListItemText primary={node.name} />
                              <IconButton
                                edge="end"
                                onClick={() => handleDeleteIngressFilterNode(node)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemButton>
                          ))}
                        </List>
                      </Grid2>
                    </Grid2>
                  </>
              </DialogContent>
              <DialogActions>
              <Button
                  variant="outlined"
                  color="primary"
                  onClick={handlerClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddIngressNodes}
                  
                >
                  Add
                </Button>
              </DialogActions>
      </Dialog>
    </form>
  );
};

export default EgressSearchIngress;
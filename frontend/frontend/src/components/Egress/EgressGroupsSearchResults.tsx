import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Box,
  Button,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
} from "@mui/material";
import SensorsIcon from "@mui/icons-material/Sensors";

import { gql, useQuery } from "@apollo/client";
import Stack from "@mui/material/Stack";
// import CurrentValue from "./CurrentValue";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import Grid2 from "@mui/material/Unstable_Grid2";
import { EgressSearchParameters } from "./EgressOverview";
import { useEffect } from "react";
const GET_ENDPOINTS = gql`
  query Query($where: EgressGroupWhere) {
    egressGroups(where: $where) {
      id
      name
      description
      accessTo {
        id
        name
        description
        accessTo {
          id
          name
          description
        }
        frequency
        dataFormat
        connectionDetails
        status
      }
    }
  }
`;

interface IEgressSearchResultProps {
  searchParameters?: EgressSearchParameters;
  onSelectEgress: (egressEndpoint: any) => void;
  onSelectGroupId?: (groupId: string) => void;
}

const EgressGroupsSearchResults: React.FC<IEgressSearchResultProps> = ({
  searchParameters,
  onSelectEgress,
  onSelectGroupId,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const { loading, error, data, refetch } = useQuery(GET_ENDPOINTS, {
    variables: {
      where: {
        ...(searchParameters && {
          accessTo_SOME: {
            ...(searchParameters.keyword?.length > 0 && {
              name_CONTAINS: searchParameters.keyword,
            }),
            ...(searchParameters.ingressEndpoints?.length > 0 && {
              accessToConnection: {
                node: {
                  id_IN: searchParameters.ingressEndpoints,
                }
              }
            }),
            ...(searchParameters.protocols?.length > 0 && {
              OR: searchParameters.protocols.map((protocol) => ({
                connectionDetails_CONTAINS: protocol,
              })),
            }),
          },
        }),
      },
    },
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    const intervalId = setInterval(refetch, 1000);
    return () => clearInterval(intervalId);
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("graph ", error);
    return <p>Error : {JSON.stringify(error)}</p>;
  }
  var properties = data.egressGroups;

  const handleShowChart = (data: any) => {
    console.log("data: ", JSON.stringify(data));

    onSelectEgress(data);
  };
  function handleDeleteItem(item: any): void {
    fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/Egress/${item.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, Content-Type, X-Auth-Token, X-Requested-With",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        refetch();
        return response.json();
      })
      .then((data) => console.log("data: " + JSON.stringify(data)))
      .catch((error) => console.error(error));
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ marginBottom: "10px" }}
      >
        <Icon component={PrecisionManufacturingIcon} sx={{ fontSize: 40 }} />
        <Typography component="div" variant="h5" sx={{ marginLeft: "10px" }}>
          {properties?.name}
        </Typography>
      </Stack>
      <Divider sx={{ marginBottom: "10px" }}>
        <Chip label="External Data Endpoints and Groups" />
        <Button onClick={() => refetch()}>Refresh</Button>
      </Divider>
      <TextField
        label="Search..."
        value={searchTerm}
        variant="filled"
        size="small"
        onChange={handleSearchTermChange}
        fullWidth
      />
      {properties
        ?.filter((item: any) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item: any, index: any) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="overline"
                sx={{ width: "33%", flexShrink: 0 }}
              >
                <Box sx={{ display: "flex", gap: '1.5rem', alignItems: "center", marginLeft: "0.4rem" }}>
                  <Box fontWeight="bold" fontSize={15}>GROUP</Box>
                  <Box fontSize={13} color="#1955B8">{item.name}</Box>
                </Box>
              </Typography>
              <Box sx={{ marginLeft: "auto" }}>
                {item.accessTo.length <= 0 && (
                  <Chip
                    label="No Egress Endpoints"
                    color="error"
                    size="small"
                    sx={{ marginRight: "10px" }}
                  />
                )}
                {item.accessTo.length > 0 && (
                  <Chip
                    label={"Contains " + item.accessTo.length + " Egress Endpoints"}
                    color="success"
                    size="small"
                    sx={{ marginRight: "10px" }}
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{
                marginBottom: "10px", display: "flex", gap: '0.7rem', flexDirection: "column",
              }}>
                <Box
                  sx={{
                    backgroundColor: "whitesmoke",
                    borderRadius: "10px",
                    paddingRight: "20px",
                    maxHeight: "8rem",
                    overflow: "auto"
                  }}
                >
                  <Typography sx={{ marginLeft: "1rem" }}>
                    <Box component="span" fontWeight="bold">
                      Description:
                    </Box>{" "}
                    {item.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    backgroundColor: "whitesmoke",
                    borderRadius: "10px",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    maxHeight: "150px",
                    overflow: "clip",
                  }}
                >
                  <List
                    dense={true}
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                    }}
                    subheader={
                      <ListSubheader sx={{ fontWeight: "bold" }}>
                        Egress Endpoints (Click for more details)
                      </ListSubheader>
                    }
                  >
                    {item.accessTo.map((node: any) => (
                      <ListItemButton
                        key={node.id}
                        sx={{
                          "&:hover": { backgroundColor: "#4f92ff" },
                        }}
                        onClick={() => handleShowChart(node)}
                      >
                        <ListItemIcon>
                          <SensorsIcon />
                        </ListItemIcon>
                        <ListItemText primary={node.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              </Box>
              {onSelectGroupId && (
                <Button
                  variant="contained"
                  onClick={() => onSelectGroupId(item.id)}
                >
                  Select
                </Button>
              )}
              {!onSelectGroupId && (
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  {/* <Button
                    variant="contained"
                    onClick={() => handleShowChart(item)}
                  >
                    Show Connection Details
                  </Button> */}
                  <Button
                    variant="outlined"
                    color="error"

                    onClick={() => handleDeleteItem(item)}
                  >
                    Delete Egress Group
                  </Button>
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
    </>
  );
};

export default EgressGroupsSearchResults;

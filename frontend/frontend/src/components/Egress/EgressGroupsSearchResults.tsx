import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
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
import { ConnectionDetails } from "./EgressConnectionDetails";
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
  searchParameters: EgressSearchParameters;
  onSelectConnectionDetails: (connectionDetails: ConnectionDetails) => void;
}

const EgressGroupsSearchResults: React.FC<IEgressSearchResultProps> = ({
  searchParameters,
  onSelectConnectionDetails,
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
              accessTo_ALL: {
                id_IN: searchParameters.ingressEndpoints,
              },
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
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("graph ", error);
    return <p>Error : {error.message}</p>;
  }
  var properties = data.egressGroups;

  const handleShowChart = (data: any) => {
    console.log("data: ", data.connectionDetails);
    const connectionDetails: ConnectionDetails = JSON.parse(
      data.connectionDetails,
      (key, value) => {
        if (key === "PROTOCOL") {
          return value;
        } else if (key === "PARAMETERS") {
          return Object.entries(value).reduce<Record<string, any>>(
            (acc, [key, value]) => {
              acc[key.toLowerCase()] = value;
              return acc;
            },
            {}
          );
        }
        return value;
      }
    );
    connectionDetails.OBSERVABLE_PROPERTY = data.accessTo;
    console.log("connectionDetails: ", connectionDetails);

    onSelectConnectionDetails(connectionDetails);
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
        sx={{ marginBottom: "20px" }}
      >
        <Icon component={PrecisionManufacturingIcon} sx={{ fontSize: 40 }} />
        <Typography component="div" variant="h5" sx={{ marginLeft: "10px" }}>
          {properties?.name}
        </Typography>
      </Stack>
      <Divider sx={{ marginBottom: "20px" }}>
        <Chip label="External Data Endpoints and Groups" />
        <Button onClick={() => refetch()}>Refresh</Button>
      </Divider>
      <TextField
        label="Search..."
        value={searchTerm}
        variant="filled"
        size="small"
        onChange={handleSearchTermChange}
        sx={{ marginBottom: "10px" }}
        fullWidth
      />
      {properties
        ?.filter((item: any) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item: any, index: any) => (
          <Accordion key={index}>
            <AccordionSummary>
              <Typography
                variant="overline"
                sx={{ width: "33%", flexShrink: 0 }}
              >
                {item.name}
              </Typography>
              <Box sx={{ marginLeft: "auto" }}>
                {item.accessTo.length <= 0 && (
                  <Chip
                    label="No Ingress Endpoints"
                    color="error"
                    size="small"
                    sx={{ marginRight: "10px" }}
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid2 container spacing={2}>
                <Grid2
                  xs={6}
                  sx={{
                    backgroundColor: "whitesmoke",
                    marginBottom: "30px",
                    marginLeft: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <Typography>
                    <Box component="span" fontWeight="bold">
                      Description:
                    </Box>{" "}
                    {item.description}
                  </Typography>
                </Grid2>
                <Grid2
                  xs={4}
                  sx={{
                    marginLeft: "20px",
                    marginRight: "20px",
                    marginBottom: "30px",
                    borderRadius: "10px",
                    backgroundColor: "whitesmoke",
                  }}
                >
                  <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                    <List
                      dense={true}
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                      }}
                      subheader={
                        <ListSubheader>Egress Endpoints</ListSubheader>
                      }
                    >
                      {item.accessTo.map((node: any) => (
                        <ListItemButton
                          key={node.id}
                          sx={{
                            "&:hover": { backgroundColor: "#f0f0f0" },
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
                </Grid2>
              </Grid2>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => handleShowChart(item)}
                >
                  Show Connection Details
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteItem(item)}
                >
                  Delete
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
    </>
  );
};

export default EgressGroupsSearchResults;

import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  Icon,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
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
  query EgressEndpoints($where: EgressEndpointWhere) {
    egressEndpoints(where: $where) {
      id
      name
      description

      accessTo {
        id
        name
      }
      frequency
      dataFormat
      connectionDetails
    }
  }
`;

interface IEgressSearchResultProps {
  searchParameters: EgressSearchParameters;
  onSelectConnectionDetails: (connectionDetails: ConnectionDetails) => void;
}

const EgressSearchResults: React.FC<IEgressSearchResultProps> = ({
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
    },
    fetchPolicy: "no-cache",
  });
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("graph ", error);
    return <p>Error : {error.message}</p>;
  }
  var properties = data.egressEndpoints;

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
    console.log("connectionDetails: ", connectionDetails);

    onSelectConnectionDetails(connectionDetails);
  };
  function handleDeleteItem(item: any): void {
    fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/Ingress/${item.id}`, {
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
        <Chip label="External Data Endpoints" />
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
                {/* <CurrentValue
                url={`${process.env.REACT_APP_DATAEXPLORER_URL}/api/DataRequest/amount/${item.id}/1`}
                refreshInterval={10000}
              /> */}
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
                  <Typography>
                    <Box component="span" fontWeight="bold">
                      Id:
                    </Box>{" "}
                    {item.id}
                  </Typography>
                  <Typography>
                    <Box component="span" fontWeight="bold">
                      Name:
                    </Box>{" "}
                    {item.name}
                  </Typography>
                  <Typography>
                    <Box component="span" fontWeight="bold">
                      AccessTo:
                    </Box>{" "}
                    {/* {item.accessTo.map((item: any) => item.name + ", ")} */}
                    {item.accessTo.map((item: any) => (
                      <Chip label={`${item.name}`} color="success" />
                    ))}
                  </Typography>
                  <Typography>
                    <Box component="span" fontWeight="bold">
                      Frequency:
                    </Box>{" "}
                    {item.frequency}
                  </Typography>
                  <Typography>
                    <Box component="span" fontWeight="bold">
                      Connection details:
                    </Box>{" "}
                    {item.connectionDetails}
                  </Typography>
                </Grid2>
              </Grid2>

              <Stack direction="row" spacing={2}>
                <Button variant="contained">Create new egress</Button>
                <Button
                  variant="contained"
                  onClick={() => handleShowChart(item)}
                >
                  Show data
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

export default EgressSearchResults;

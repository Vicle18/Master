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
import CurrentValue from "./CurrentValue";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import Grid2 from "@mui/material/Unstable_Grid2";
const GET_DATA_FOR_CONTAINING_ENTITY = gql`
  query GetDataForContainingEntity($where: ResourceWhere) {
    resources(where: $where) {
      name
      ObservableProperties {
        id
        name
        description
        topic {
          name
        }
        frequency
      }
    }
  }
`;

interface IDetailedViewProps {
  containingEntityId: any;
  onOpenChart: (data: any) => void;
  withDetails?: boolean;
}

const DetailedView: React.FC<IDetailedViewProps> = ({
  containingEntityId,
  onOpenChart,
  withDetails,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const { loading, error, data } = useQuery(GET_DATA_FOR_CONTAINING_ENTITY, {
    variables: { where: { name: containingEntityId } },
    fetchPolicy: "no-cache",
  });
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("graph ", error);
    return <p>Error : {error.message}</p>;
  }
  var properties = data.resources[0];

  const handleShowChart = (data: any) => {
    const newData = {
      id: data.id,
      name: data.name,
      frequency: data.frequency,
      topic: data.topic.name,
    };
    onOpenChart(newData);
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
        <Chip label="Observable Properties" />
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
      {properties?.ObservableProperties?.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((item: any, index: any) => (
        <Accordion key={index}>
          <AccordionSummary>
            <Typography variant="overline" sx={{ width: "33%", flexShrink: 0 }}>
              {item.name}
            </Typography>
            <Box sx={{ marginLeft: "auto" }}>
              <CurrentValue
                url={`${process.env.REACT_APP_DATAEXPLORER_URL}/api/DataRequest/amount/${item.id}/1`}
                refreshInterval={10000}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {withDetails && (
              <>
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
                        Topic:
                      </Box>{" "}
                      {item.topic.name}
                    </Typography>
                    <Typography>
                      <Box component="span" fontWeight="bold">
                        Frequency:
                      </Box>{" "}
                      {item.frequency}
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
              </>
            )}
            {!withDetails && (
              <>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => handleShowChart(item)}
                  >
                    Add
                  </Button>
                </Stack>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default DetailedView;

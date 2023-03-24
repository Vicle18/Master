import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { Box, Button, Icon, TextField } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import Stack from "@mui/material/Stack";
import CurrentValue from "./CurrentValue";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
const GET_DATA_FOR_CONTAINING_ENTITY = gql`
  query GetDataForContainingEntity($where: ResourceWhere) {
    resources(where: $where) {
      name
      ObservableProperties {
        id
        name
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
    fetchPolicy: "no-cache" 
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
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              {item.name}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {item.topic.name}
            </Typography>
            <Box sx={{ marginLeft: "auto" }}>
              <CurrentValue
                // url={`http://localhost:5001/input/${item.topic.name}`}
                url={`${process.env.REACT_APP_DATAEXPLORER_URL}/api/DataRequest/amount/${item.topic.name}/1`}
                refreshInterval={10000}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {withDetails && (
              <>
                <Typography>"Some details"</Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained">Create new egress</Button>
                  <Button
                    variant="contained"
                    onClick={() => handleShowChart(item)}
                  >
                    Show data
                  </Button>
                  <Button variant="outlined" color="error">
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

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
  StepLabel,
  TextField,
} from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import Stack from "@mui/material/Stack";
import CurrentValue from "./CurrentValue";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import Grid2 from "@mui/material/Unstable_Grid2";
import { log } from "console";
import { initialValues } from "./createv2/FormDefinition";
import EditIngressStepper from "./edit/EditIngressStepper";
import CreateEgressStepper from "../Egress/create/CreateEgressStepper";
import { egressInitialValues } from "../Egress/create/FormDefinition";

const GET_DATA_FOR_CONTAINING_ENTITY = gql`
query Company($where: AreaWhere, $cellsWhere2: CellWhere, $machinesWhere2: MachineWhere, $companiesWhere2: CompanyWhere, $observablePropertiesWhere2: ObservablePropertyWhere, $linesWhere2: LineWhere, $plantsWhere2: PlantWhere) {
  areas(where: $where) {
    id
    name
    description
    observableProperties {
      id
      name
      description
      topic {
        name
      }
      frequency
      connectionDetails
      changedFrequency
      dataFormat
      dataType
      downsampleMethod
    }
  }
  cells(where: $cellsWhere2) {
    id
    name
    description
    observableProperties {
      id
      name
      description
      topic {
        name
      }
      frequency
      connectionDetails
      changedFrequency
      dataFormat
      dataType
      downsampleMethod
    }
  }
  machines(where: $machinesWhere2) {
    id
    name
    description
    observableProperties {
      id
      name
      description
      topic {
        name
      }
      frequency
      connectionDetails
      changedFrequency
      dataFormat
      dataType
      downsampleMethod
    }
  }
  companies(where: $companiesWhere2) {
    id
    name
    description
    observableProperties {
      id
      name
      description
      topic {
        name
      }
      frequency
      connectionDetails
      changedFrequency
      dataFormat
      dataType
      downsampleMethod
    }
  }
  lines(where: $linesWhere2) {
    id
    name
    description
    observableProperties(where: $observablePropertiesWhere2) {
      id
      name
      description
      topic {
        name
      }
      frequency
      connectionDetails
      changedFrequency
      dataFormat
      dataType
      downsampleMethod
    }
  }
  plants(where: $plantsWhere2) {
    id
    name
    description
    observableProperties(where: $observablePropertiesWhere2) {
      id
      name
      description
      topic {
        name
      }
      frequency
      connectionDetails
      changedFrequency
      dataFormat
      dataType
      downsampleMethod
    }
  }
}
`;

interface ObjectWithProperties {
  id: string;
  name: string;
  description: string;
  observableProperties: {
    id: string;
    name: string;
    description: string;
    topic: {
      name: string;
    };
    frequency: number;
    changedFrequency: number;
    connectionDetails: JSON;
    dataFormat: string;
    dataType: string;
    downsampleMethod: string;

  }[];
}

interface QueryResult {

  areas: ObjectWithProperties[];
  cells: ObjectWithProperties[];
  machines: ObjectWithProperties[];
  companies: ObjectWithProperties[];
  lines: ObjectWithProperties[];
  plants: ObjectWithProperties[];

}

interface IDetailedViewProps {
  containingEntityId: any;
  onOpenChart: (data: any) => void;
  withDetails?: boolean;
}
export var previousPropertyValues: any = "";


const DetailedView: React.FC<IDetailedViewProps> = ({
  containingEntityId,
  onOpenChart,
  withDetails,
}) => {

  const [searchTerm, setSearchTerm] = React.useState("");
  const [PopupEditIngress, setPopupEditIngress] = React.useState(false);
  const [PopupCreateEgress, setPopupCreateEgress] = React.useState(false);
  const [showEditEndpoint, setShowEditEndpoint] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedContainingElement, setSelectedParent] = React.useState<string>("");
  const [openSnackbar, setOpenSnackbar] = React.useState(true);
  const [result, setResult] = React.useState<string | null>(null);
  const steps = ["Change Property Values"];
  const [selectedIngress, setSelectedIngress] = React.useState("")

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const { loading, error, data: queryResult, refetch } = useQuery<QueryResult>(GET_DATA_FOR_CONTAINING_ENTITY, {
    variables: {
      "where": {
        "id": containingEntityId
      },
      "cellsWhere2": {
        "id": containingEntityId
      },
      "machinesWhere2": {
        "name": containingEntityId
      },
      "companiesWhere2": {
        "id": containingEntityId
      },
      "linesWhere2": {
        "id": containingEntityId
      },
      "plantsWhere2": {
        "id": containingEntityId
      }
    },
    fetchPolicy: "no-cache",
  });
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("graph ", error);
    return <p>Error : {error.message}</p>;
  }

  const dataObjects = [
    ...queryResult?.areas || [],
    ...queryResult?.cells || [],
    ...queryResult?.machines || [],
    ...queryResult?.companies || [],
    ...queryResult?.lines || [],
    ...queryResult?.plants || []
  ];

  var properties: ObjectWithProperties = dataObjects[0];


  // handle the close event
  const handleClose = () => {
    setPopupEditIngress(false);
  };

  const handleResult = (result: string) => {
    console.log(`Result: ${result}`);
    setOpenSnackbar(true);
    setResult(result);
  };

  // handle the finish event
  // const handleFinish = (values: any) => {
  //   console.log("Finish him")
  //   handleClose();
  //   console.log(values)


  //   fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/Ingress/update?=`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  //       "Access-Control-Allow-Headers":
  //         "Origin, Content-Type, X-Auth-Token, X-Requested-With",
  //     },
  //     body: JSON.stringify(values),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => console.log("data: " + data))
  //     .catch((error) => console.error(error));
  // };


  const handleShowEdit = (data: any) => {
    previousPropertyValues = data
    console.log("data data data")
    console.log(data.downsampleMethod)
    console.log(data.dataType)
    const connectionDetails = JSON.parse(data.connectionDetails)
    initialValues.protocol = connectionDetails.PROTOCOL

    if (connectionDetails.PROTOCOL == "MQTT") {
      initialValues.port = connectionDetails.PARAMETERS.PORT
      initialValues.host = connectionDetails.PARAMETERS.HOST
    } else if (connectionDetails.PROTOCOL == "RTDE") {
      initialValues.port = connectionDetails.PARAMETERS.PORT.toString()
      initialValues.host = connectionDetails.PARAMETERS.HOST.toString()
    } else if (connectionDetails.PROTOCOL == "OPCUA") {
      initialValues.nodeId = connectionDetails.PARAMETERS.NODENAME
      // TODO SØRG FOR VED UPDATE I MIDDLE_WARE AT REQUEST ET KILL POD OSV. OG LAVE EN NY MED DE NYE CONNECTIONDETAILS
    }
    initialValues.name = data.name
    initialValues.description = data.description
    initialValues.frequency = data.frequency
    initialValues.changedFrequency = data.changedFrequency
    initialValues.dataFormat = data.dataFormat
    initialValues.id = data.id
    initialValues.dataType = data.dataType
    initialValues.downsampleMethod = data.downsampleMethod
    setShowEditEndpoint(true);
    setPopupEditIngress(true);
  }

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
        refetch();
        return response.json();
      })
      .then((data) => console.log("data: " + JSON.stringify(data)))
      .catch((error) => console.error(error));
  }

  function handleCreateEgress(item: any) {
    setSelectedIngress(item);
    egressInitialValues.ingressId = item.id;
    setPopupCreateEgress(true);
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
      {properties?.observableProperties?.filter((item: any) =>
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

                <Stack direction="row" spacing={1}>
                  <Button variant="contained" style={{ fontSize: "12px" }} onClick={() => { handleCreateEgress(item) }}>Create Egress</Button>
                  {PopupCreateEgress && (
                    <CreateEgressStepper PopupEgress handleResult={handleResult} setPopupEgress={setPopupCreateEgress} selectedIngress={selectedIngress}></CreateEgressStepper>
                  )}
                  <Button variant="contained" style={{ fontSize: "12px" }} onClick={() => { handleShowEdit(item) }}>Edit Endpoint</Button>
                  {PopupEditIngress && (
                    <EditIngressStepper PopupIngress handleResult={handleResult} setPopupIngress={setPopupEditIngress}></EditIngressStepper>
                  )}
                  <Button
                    variant="contained"
                    style={{ fontSize: "12px" }}
                    onClick={() => handleShowChart(item)}
                  >
                    Show data
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ fontSize: "12px" }}
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
}




export default DetailedView;




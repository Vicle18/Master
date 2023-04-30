import { gql, useQuery } from "@apollo/client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { CreateTelegramTemplate } from "./TemplateCreator";

interface ConnectionDetailsProps {
  egressEndpoint: string;
}

const GET_ENDPOINTS = gql`
  query EgressEndpoints($where: EgressEndpointWhere) {
    egressEndpoints(where: $where) {
      id
      name
      description
      accessTo {
        id
        name
        changedFrequency
        connectionDetails
        errorStateAt
        dataFormat
        description
        frequency
        lastUpdatedAt
        propertyOf {
          id
          name
          description
        }
        status
        topic {
          name
        }
      }
      frequency
      dataFormat
      connectionDetails
      changedFrequency
      egressGroup {
        id
        name
        description
      }
      lastUpdatedAt
      status
    }
  }
`;

const ConnectionDetailsDisplay: FC<ConnectionDetailsProps> = ({
  egressEndpoint,
}) => {
  const [resultDelete, setResultDelete] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(true);
  const [expandedPanel1, setExpandedPanel1] = useState<string | false>('panel1');
  const [expandedPanel2, setExpandedPanel2] = useState<string | false>('panel2');

  const [currentValueOfIngress, setCurrentValueOfIngress] =
    useState<string>("not found");
  const [fetchingCurrentValue, setFetchingCurrentValue] =
    useState<boolean>(true);
  const { loading, error, data, refetch } = useQuery(GET_ENDPOINTS, {
    variables: {
      where: {
        id: egressEndpoint,
      },
    },
    fetchPolicy: "no-cache",
  });
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChangePanel1 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpandedPanel1(newExpanded ? panel : false);
    };

  const handleChangePanel2 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpandedPanel2(newExpanded ? panel : false);
    };

  const handleResultInSnackbar = (result: string) => {
    console.log(`Result: ${result}`);
    setOpenSnackbar(true);
    setResultDelete(result);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (data?.egressEndpoints[0]?.accessTo?.id) {
        var url = `${process.env.REACT_APP_DATAEXPLORER_URL}/api/DataRequest/amount/${data?.egressEndpoints[0]?.accessTo.id}/1`;
        setFetchingCurrentValue(true);
        try {
          const response = await axios.get(url);

          setCurrentValueOfIngress(response.data[0].value);

          setFetchingCurrentValue(false);
        } catch (error) {
          // console.log(error);
          setFetchingCurrentValue(false);
        }
      }
    };

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("graph ", error);
    return <p>Error : {error.message}</p>;
  }
  if (data.egressEndpoints.length <= 0)
    return (
      <Box
        sx={{
          backgroundColor: "rgba(255, 165, 0, 0.9)",
          border: "1px solid white",
          p: 2,
          marginLeft: "13px",
          borderRadius: "10px",
          marginRight: "13px",
          color: "white",
          alignItems: "center",
          display: "flex",
          "& p": {
            marginLeft: "10px", // add some margin between the icon and the paragraph
          },
        }}
      >
        <InfoIcon />
        <p>Please select an egress endpoint to view connection details.</p>
      </Box>
    );

  var endpoint = data.egressEndpoints[0];
  var connectionDetails = JSON.parse(endpoint.connectionDetails);

  function handleDelete(): void {
    fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/Egress/${endpoint.id}`, {
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
      .then((data) => {
        console.log("data: " + JSON.stringify(data));
        setResultDelete(data);
        handleResultInSnackbar(data);
      })
      .catch((error) => {
        console.error(error);
        setResultDelete("error");
        handleResultInSnackbar("error");
      });
  }

  function handleEdit(): void {
    throw new Error("Function not implemented.");
  }

  function handleDownloadTelegram(): void {
    var data = "empty"
    if (connectionDetails?.PROTOCOL == "MQTT") {
      data = CreateTelegramTemplate(
        connectionDetails?.PARAMETERS?.HOST,
        connectionDetails?.PARAMETERS?.PORT,
        connectionDetails?.TRANSMISSION_DETAILS?.TARGET
      );
    }

    const element = document.createElement("a");

    const file = new Blob([data], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `Telegram_${endpoint.name}_${connectionDetails?.PROTOCOL}.yaml`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <div>
      
      <Divider sx={{ marginBottom: "20px" }}>
        <Chip label={"Detailed information for " + endpoint.name} />
      </Divider>
      <Accordion expanded={expandedPanel1 === 'panel1'} onChange={handleChangePanel1('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content1"
          id="panel1a-header1"
        >
          <Typography>What data do I get?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          The data you get from the egress endpoint{" "}
          <Box component="span" fontWeight="bold">
            {endpoint.name}
          </Box>{" "}
          is in called{" "}
          <Box component="span" fontWeight="bold">
            {endpoint.accessTo.name}
          </Box>{" "}
          and comming from the machine{" "}
          <Box component="span" fontWeight="bold">
            {endpoint.accessTo.propertyOf.name}
          </Box>{" "}
          . The current value of the data is:{" "}
          <Box component="span" fontWeight="bold">
            {currentValueOfIngress}
          </Box>{" "}
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expandedPanel2 === 'panel2'} onChange={handleChangePanel2('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content2"
          id="panel1a-header2"
        >
          <Typography>How do I connect?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            To connect to the egress endpoint {endpoint?.name} with the protocol{" "}
            {connectionDetails?.PROTOCOL}, you can use the following details to
            connect:
          </Typography>

          {connectionDetails?.PARAMETERS &&
            Object.entries(connectionDetails?.PARAMETERS).map(
              ([key, value]) =>
                value != null && (
                  <Typography key={key}>
                    <Box component="span" fontWeight="bold">
                      {key.replace("_", " ").toLowerCase()}:
                    </Box>{" "}
                    {JSON.stringify(value)}
                  </Typography>
                )
            )}
          <Typography style={{ wordBreak: "break-all" }}>
            And since you are using the {connectionDetails?.PROTOCOL} protocol,
            you use the{" "}
            {connectionDetails?.PROTOCOL == "MQTT" ? "MQTT Topic" : "NodeID"}:{" "}
            {connectionDetails?.TRANSMISSION_DETAILS?.TARGET} to extract
            information
          </Typography>
          <Box sx={{ height: "20px" }} />

          <Button
            color="primary"
            variant="contained"
            onClick={handleDownloadTelegram}
            disabled={connectionDetails?.PROTOCOL != "MQTT"}
          >
            Download Telegram Template
          </Button>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content3"
          id="panel2a-header3"
        >
          <Typography>More Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {connectionDetails?.TRANSMISSION_DETAILS && (
            <>
              Here you can see more details about the data, i.e. the frequency,
              the data format, etc.
              {Object.entries(connectionDetails?.TRANSMISSION_DETAILS).map(
                ([key, value]) =>

                  value != null && !["DOWN_SAMPLING_METHOD", "CHANGED_FREQUENCY"].includes(key.toString()) && (
                    <Typography style={{ wordBreak: "break-all" }} key={key}>
                      <Box component="span" fontWeight="bold">
                        {key.replace("_", " ").toLowerCase()}:
                      </Box>{" "}
                      {JSON.stringify(value)}
                    </Typography>
                  )
              )}
            </>
          )}
        </AccordionDetails>
      </Accordion>
      <Box sx={{ height: "20px" }} />

      <Divider sx={{ marginBottom: "20px" }}>
        <Chip label={"Manage " + endpoint.name} />
      </Divider>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <Button color="primary" variant="contained" onClick={handleEdit}>
          Edit Egress Endpoint
        </Button>
        <Box sx={{ width: "1px", height: "10px" }} />
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete Egress Endpoint
        </Button>
      </Box>
      {resultDelete && (<Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        autoHideDuration={3000}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        message={resultDelete}
      >
        {resultDelete === "error" ? (
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {resultDelete}
          </Alert>
        ) : (
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {
              "Egress Endpoint successfully Deleted"
            }
          </Alert>
        )}
      </Snackbar>)}
    </div>
  );
};

export default ConnectionDetailsDisplay;

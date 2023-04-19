import { gql, useQuery } from "@apollo/client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

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
    fetch(
      `${process.env.REACT_APP_MIDDLEWARE_URL}/api/Ingress/${endpoint.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, Content-Type, X-Auth-Token, X-Requested-With",
        },
      }
    )
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

  function handleEdit(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <Typography variant="h5"></Typography>
      <Divider sx={{ marginBottom: "20px" }}>
        <Chip label={"Detailed information for " + endpoint.name} />
      </Divider>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
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
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
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
                  <Typography>
                    <Box component="span" fontWeight="bold">
                      {key}:
                    </Box>{" "}
                    {JSON.stringify(value)}
                  </Typography>
                )
            )}
          <Typography>
            And since you are using the {connectionDetails?.PROTOCOL} protocol,
            you use the{" "}
            {connectionDetails?.PROTOCOL == "MQTT" ? "MQTT Topic" : "NodeID"}:{" "}
            {connectionDetails?.TRANSMISSION_DETAILS?.TARGET} to extract
            information
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
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
                  value != null && (
                    <Typography>
                      <Box component="span" fontWeight="bold">
                        {key}:
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
      <Button color="error" variant="contained" onClick={handleDelete}>
        Delete
      </Button>
      <Button color="primary" variant="contained" onClick={handleEdit}>
        Edit
      </Button>
    </div>
  );
};

export default ConnectionDetailsDisplay;

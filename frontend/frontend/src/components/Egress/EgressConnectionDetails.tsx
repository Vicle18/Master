import { Box, Divider, Typography } from "@mui/material";
import { FC } from "react";

interface ConnectionDetailsProps {
  connectionDetails: ConnectionDetails;
}

export interface ConnectionDetails {
  PROTOCOL: string;
  PARAMETERS: Record<string, any>;
  TRANSMISSION_DETAILS?: Record<string, any>;
  OBSERVABLE_PROPERTY?: string;
}

const ConnectionDetailsDisplay: FC<ConnectionDetailsProps> = ({
  connectionDetails,
}) => {
  console.log("ConnectionDetailsDisplay", connectionDetails);

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Typography variant="h5">Connection Details</Typography>
      <Divider />
      <Typography>
        <Box component="span" fontWeight="bold">
          Protocol:
        </Box>{" "}
        {connectionDetails?.PROTOCOL?.toUpperCase()}
      </Typography>
      {Object.entries(connectionDetails.PARAMETERS).map(
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
      {connectionDetails.TRANSMISSION_DETAILS && (
        <>
          <Typography variant="h5">Transmission Details</Typography>
          <Divider />
          {Object.entries(connectionDetails.TRANSMISSION_DETAILS).map(
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
    </Box>
  );
};

export default ConnectionDetailsDisplay;

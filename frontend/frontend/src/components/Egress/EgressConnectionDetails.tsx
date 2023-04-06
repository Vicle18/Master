import { Box, Divider, Typography } from "@mui/material";
import { FC } from "react";

interface ConnectionDetailsProps {
  connectionDetails: ConnectionDetails;
}

export interface ConnectionDetails {
  PROTOCOL: string;
  PARAMETERS: Record<string, any>;
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
        {connectionDetails.PROTOCOL}
      </Typography>
      {Object.entries(connectionDetails.PARAMETERS).map(([key, value]) => (
        <Typography>
          <Box component="span" fontWeight="bold">
            {key}:
          </Box>{" "}
          {JSON.stringify(value)}
        </Typography>
      ))}
    </Box>
  );
};

export default ConnectionDetailsDisplay;

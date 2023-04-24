import React, { useState, useEffect } from "react";
import axios from "axios";
import Chip from "@mui/material/Chip";
import SensorsIcon from "@mui/icons-material/Sensors";
import SensorsOffIcon from "@mui/icons-material/SensorsOff";
import { gql, useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
interface IApiDataProps {
  ingressId: string;
  refreshInterval?: number;
}

const GET_LOCATIONS = gql`
  query Status($where: ObservablePropertyWhere) {
    observableProperties(where: $where) {
      lastUpdatedAt
      status
      errorStateAt
      id
    }
  }
`;

const IngressStatus: React.FC<IApiDataProps> = ({
  ingressId,
  refreshInterval = 1000,
}) => {
  const { loading, error, data, refetch } = useQuery(GET_LOCATIONS, {
    variables: { where: { id: ingressId } },
  });

  useEffect(() => {
    const intervalId = setInterval(refetch, refreshInterval);

    return () => clearInterval(intervalId);
  }, [ingressId, refreshInterval]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  function hasConnection(): boolean {
    if (data?.observableProperties[0]?.status) {
      if (data?.observableProperties[0]?.status == "running") {
        return true;
      }
      return false;
    }
    return false;
  }
  return (
    <div>
      <div>
        {hasConnection() ? (
          <Tooltip
            title={`Current status: ${
              data?.observableProperties[0]?.status ?? "not found"
            }, last updated: ${
              data?.observableProperties[0]?.lastUpdatedAt ?? "not found"
            }`}
          >
            <SensorsIcon color="success" />
          </Tooltip>
        ) : (
          <Tooltip
            title={`Current status: ${
              data?.observableProperties[0]?.status ?? "not found"
            }, last updated: ${
              data?.observableProperties[0]?.lastUpdatedAt ?? "not found"
            }, error state at: ${
              data?.observableProperties[0]?.errorStateAt ?? "not found"
            }`}
          >
            <SensorsOffIcon color="error" />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default IngressStatus;

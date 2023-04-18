import * as React from "react";
import { gql, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import EgressFilter from "./EgressFilter";
import EgressSearchResults from "./EgressSearchResults";
import ConnectionDetailsDisplay, { ConnectionDetails } from "./EgressConnectionDetails";
import EgressGroupsSearchResults from "./EgressGroupsSearchResults";

interface EgressOverviewProps {
  //onItemClick: (data: any) => void;
}


const GET_ENDPOINTS = gql`query EgressEndpoints($where: EgressEndpointWhere) {
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
`
export interface EgressSearchParameters {
  keyword: string;
  ingressEndpoints: string[];
  protocols: string[];
}


const EgressOverview: React.FC<EgressOverviewProps> = ({}) => {
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [selectedDataForChart, setSelectedDataForChart] = useState(null);
  const [selectedView, setSelectedView] = useState("");
  const [selectedConnectionDetails, setSelectedConnectionDetails] = useState<ConnectionDetails>({
    PROTOCOL: "No element selected",
    PARAMETERS: [],
  });
  const [searchParameters, setSearchParameters] =
    useState<EgressSearchParameters>({
      keyword: "",
      ingressEndpoints: [],
      protocols: [],
    });
    
  useEffect(() => {
    console.log(searchParameters);
  }, [searchParameters]);

  const handleItemClick = (data: any) => {
    setSelectedItemData(data);
  };

  const handleSelectConnectionDetails = (data: any) => {
    console.log("handleSelectConnectionDetails", data);
    setSelectedConnectionDetails(data);
  };

  const handleSearchResult = (data: any) => {
    console.log("handleSearchResult", data);
    
    setSelectedItemData(data);
  };

  return (
    <>
      <Box sx={{ flexGrow: 6, height: "90vh" }}>
        <Grid2 container spacing={2} sx={{ height: "100%" }}>
          <Grid2
            xs={2}
            sx={{
              marginTop: "30px",
              marginLeft: "20px",
              marginRight: "20px",
              borderRadius: "10px",
              backgroundColor: "whitesmoke",
            }}
          >
            <EgressFilter
              onSearch={handleSearchResult}
              egressSearchParameters={searchParameters}
              setEgressSearchParameters={setSearchParameters}
            />
          </Grid2>
          <Grid2
            xs={5.2}
            sx={{
              marginTop: "30px",
              marginRight: "20px",
              borderRadius: "10px",
              backgroundColor: "whitesmoke",
            }}
          >
            <EgressGroupsSearchResults searchParameters={searchParameters} onSelectConnectionDetails={handleSelectConnectionDetails} />
          </Grid2>
          <Grid2
            xs
            sx={{
              marginTop: "30px",
              marginRight: "50px",
              borderRadius: "10px",
              backgroundColor: "whitesmoke",
            }}
          >
            <ConnectionDetailsDisplay connectionDetails={selectedConnectionDetails} />
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
};

export default EgressOverview;

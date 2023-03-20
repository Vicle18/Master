import * as React from "react";
import { gql, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2";
import DetailedView from "./IngressDetailed";
import Chart from "./DataChart";
import { useState } from "react";
import IngressOverviewLeft from "./IngressOverviewLeft";

interface IngressOverviewProps {
  //onItemClick: (data: any) => void;
}

const IngressOverview: React.FC<IngressOverviewProps> = ({  }) => {
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [selectedDataForChart, setSelectedDataForChart] = useState(null);
  const [selectedView, setSelectedView] = useState("");

  const handleItemClick = (data: any) => {
    setSelectedItemData(data);
  };

  const handleOpenChart = (data: any) => {
    setSelectedDataForChart(data);
  };

  return (
    <>
        <Box sx={{ flexGrow: 6, height: "90vh" }}>

        <Grid2 container spacing={2} sx={{ height: "100%" }}>
          <Grid2
            xs={2.5}
            sx={{
              marginTop: "30px",
              marginLeft: "20px",
              marginRight: "20px",
              borderRadius: "10px",
              backgroundColor: "whitesmoke",
            }}
          >
            <IngressOverviewLeft onItemClick={handleItemClick} />
          </Grid2>
          <Grid2
            xs={5}
            sx={{
              marginTop: "30px",
              marginRight: "20px",
              borderRadius: "10px",

              backgroundColor: "whitesmoke",
            }}
          >
            <DetailedView
              containingEntityId={selectedItemData}
              onOpenChart={handleOpenChart}
              withDetails={true}
            />
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
            <Chart
              refreshInterval={10000}
              chartMetadata={selectedDataForChart}
            />
          </Grid2>
        </Grid2>
        </Box>
    </>
  );
};

export default IngressOverview;

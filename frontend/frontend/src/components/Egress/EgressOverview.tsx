import * as React from "react";
import { gql, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useState } from "react";

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
            xs={2}
            sx={{
              marginTop: "30px",
              marginLeft: "20px",
              marginRight: "20px",
              borderRadius: "10px",
              backgroundColor: "whitesmoke",
            }}
          >
            "test"
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
            "test3"
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
            "test2"
          </Grid2>
        </Grid2>
        </Box>
    </>
  );
};

export default IngressOverview;

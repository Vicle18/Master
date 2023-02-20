import { FC, useState } from "react";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2";
import DetailedView from "../../components/IngressDetailed";
import Chart from "../../components/DataChart";
import IngressOverview from "../../components/IngressOverview";
interface OverviewProps {
  title: string;
}

const Overview: FC<OverviewProps> = ({ title }) => {
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [selectedDataForChart, setSelectedDataForChart] = useState(null);

  const handleItemClick = (data: any) => {
    // console.log('data at parent', data);
    setSelectedItemData(data);
  };

  const handleOpenChart = (data: any) => {
    // console.log('data at parent', data);
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
            <IngressOverview onItemClick={handleItemClick} />
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
            <DetailedView
              containingEntityId={selectedItemData}
              onOpenChart={handleOpenChart}
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

export default Overview;

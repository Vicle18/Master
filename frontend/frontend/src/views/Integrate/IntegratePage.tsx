import { Skeleton, Box } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { FC } from 'react';

interface IntegrateProps {
  title: string;
}

const Integrate: FC<IntegrateProps> = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
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
          <Skeleton variant="rectangular" width={210} height={118} />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="50%" />
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="55%" />
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="75%" />
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="70%" />
          </Box>
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
          <Skeleton variant="rectangular" width={210} height={118} />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="50%" />
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="55%" />
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="75%" />
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="70%" />
          </Box>{" "}
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
          <Skeleton variant="rectangular" width={210} height={118} />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="50%" />
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="55%" />
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="75%" />
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="70%" />
          </Box>{" "}
        </Grid2>
      </Grid2>
    </>
  );
};

export default Integrate;
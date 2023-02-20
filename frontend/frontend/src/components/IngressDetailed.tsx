import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import CurrentValue from './CurrentValue';
const GET_DATA_FOR_CONTAINING_ENTITY = gql`
query GetDataForContainingEntity($where: ResourceWhere) {
    resources(where: $where) {
        ObservableProperties {
            name
            topic {
              name
            }
          }
    }
}
`;


interface IData {
    name: string;
}
  
interface IDetailedViewProps {
    containingEntityId: any;
}
  
const DetailedView: React.FC<IDetailedViewProps> = ({ containingEntityId }) => {
    const { loading, error, data } = useQuery(
        GET_DATA_FOR_CONTAINING_ENTITY, {variables: {where: {name: containingEntityId}}});
    if (loading) return <p>Loading...</p>;
    if (error) {
        console.log("graph ", error);
        return <p>Error : {error.message}</p>;
    }
    var properties = data.resources[0];


    return (
        <>
            {properties?.ObservableProperties?.map((item: any, index: any) => (
            <Accordion key={index}>
                <AccordionSummary>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>{item.name}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{item.topic.name}</Typography>
                <Box sx={{ marginLeft: 'auto' }}>
                    <CurrentValue 
                    url={`http://localhost:5001/example`}
                    refreshInterval={1000}
                    />
                </Box>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>"Some details"</Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained">Create new egress</Button>
                    <Button variant="contained">Show data</Button>
                    <Button variant="outlined" color="error">Delete</Button>
                </Stack>
                </AccordionDetails>
            </Accordion>
            ))}
        </>
    );
};
  
  export default DetailedView;
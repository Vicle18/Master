import {
  Box,
  ClickAwayListener,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Popper,
  Stack,
  TextField,
  Theme,
} from "@mui/material";
import React, { useState } from "react";
import EgressSearchIngress from "./EgressFilterIngressSearch";
import EgressFilterProtocol from "./EgressFilterProtocol";
import EgressSearchBar from "./EgressFilterSearch";
import { EgressSearchParameters } from "./EgressOverview";

interface Props {
  onSearch: (parameters: EgressSearchParameters) => void;
  egressSearchParameters: EgressSearchParameters;
  setEgressSearchParameters: (parameters: EgressSearchParameters) => void;
}

const EgressFilter: React.FC<Props> = ({ onSearch, egressSearchParameters, setEgressSearchParameters }) => {
  const [query, setQuery] = useState("");
  const [ingressFilter, setIngressFilter] = useState<string[]>([]);
  const [protocolFilter, setProtocolFilter] = useState<string[]>([]);



  const handleOnSearch = (query: string) => {
    setQuery(query);
    setEgressSearchParameters({...egressSearchParameters, keyword: query});
  };

  const handleOnApplyIngressSearch = (selected: string[]) => {
    setIngressFilter(selected);
    setEgressSearchParameters({...egressSearchParameters, ingressEndpoints: selected});
  };

  const handleOnApplyProtocolSearch = (selected: string[]) => {
    setProtocolFilter(selected);
    setEgressSearchParameters({...egressSearchParameters, protocols: selected});
  };

  return (
    <div>
      <Stack>
        <Box
          sx={{
            borderRadius: "10px",
            backgroundColor: "azure",
            padding: "10px",
          }}
        >
          Search for Egress Data points
          <EgressSearchBar onSearch={handleOnSearch} />
        </Box>
        <Box
          sx={{
            marginTop: "10px",
            borderRadius: "10px",
            backgroundColor: "azure",
            padding: "10px",
          }}
        >
          Filter by Ingress Data points
          <EgressSearchIngress onApply={handleOnApplyIngressSearch} />
        </Box>
        <Box
          sx={{
            marginTop: "10px",
            borderRadius: "10px",
            backgroundColor: "azure",
            padding: "10px",
          }}
        >
          Filter by Protocols
          <EgressFilterProtocol onApply={handleOnApplyProtocolSearch} />
        </Box>
        
      </Stack>
    </div>
  );
};

export default EgressFilter;

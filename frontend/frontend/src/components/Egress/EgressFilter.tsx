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
import EgressSearchBar from "./EgressFilterSearch";

interface Props {
  onSearch: (query: string) => void;
}

const EgressFilter: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [ingressFilter, setIngressFilter] = useState<string[]>([]);
  const [protocolFilter, setProtocolFilter] = useState<string[]>([]);



  const handleOnSearch = (query: string) => {
    setQuery(query);
    onSearch(query);
  };

  const handleOnApplyIngressSearch = (selected: string[]) => {
    setIngressFilter(selected);
  };

  const handleOnApplyProtocolSearch = (selected: string[]) => {
    setProtocolFilter(selected);
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
          <EgressSearchIngress onApply={handleOnApplyProtocolSearch} />
        </Box>
        
      </Stack>
    </div>
  );
};

export default EgressFilter;

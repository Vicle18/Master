import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepButton,
  Box,
  Button,
  DialogActions,
  Divider,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Switch,
  Checkbox,
  Snackbar,
  Alert
} from "@mui/material";

import { isValid } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import SensorsIcon from "@mui/icons-material/Sensors";
import InfoIcon from "@mui/icons-material/Info";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Grid2 from "@mui/material/Unstable_Grid2";
import IngressOverviewLeft from "../Ingress/IngressOverviewLeft";
import { gql, useQuery } from "@apollo/client";
import { AddBox } from "@mui/icons-material";
import { create } from "domain";

interface Props {
  setPopupImport: React.Dispatch<React.SetStateAction<boolean>>;
  PopupImport: boolean;
}

const steps = [
  "Select Parent",
  "Select file to import",
  "Select Machines to Add",
];
interface Machine {
  observableProperties: {
    [key: string]: any;
  }[];
}

const GET_OBSERVABLE_PROPERTIES = gql`
  query Machines($where: ObservablePropertyWhere) {
    observableProperties(where: $where) {
      id
      name
    }
  }
`;

const ImportStepper: React.FC<Props> = ({ PopupImport, setPopupImport }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [creationStarted, setCreationStarted] = React.useState(false);
  const [currentlySelectedContainer, setCurrentlySelectedContainer] =
    useState<any>();
  const [selectedContainer, setSelectedContainer] = useState<any>();
  const [json, setJson] = useState<any>();
  const [finished, setFinished] = useState(false);

  const { loading, error, data, refetch } = useQuery(
    GET_OBSERVABLE_PROPERTIES,
    {
      variables: {
        where: {
          id_IN:
            json?.machines?.[0]?.observableProperties?.map(
              (observableProperty: any) => observableProperty.id
            ) || [],
        },
      },
    }
  );
  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error : {error.message}</p>;

  const handlerClose = () => {
    setCurrentlySelectedContainer("");
    setSelectedContainer("");
    setCreationStarted(false);
    setPopupImport(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  const handleDelete = (element: string) => {
    // setSelectedContainer(selectedContainer.filter((node) => node !== element));
  };

  const handleCheckboxChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedJson = {
        ...json,
        machines: json?.machines?.map((machine: Machine) => ({
          ...machine,
          observableProperties: machine?.observableProperties?.map(
            (observableProperty, i) => {
              if (i === index) {
                return {
                  ...observableProperty,
                  checked: event.target.checked,
                };
              }
              return observableProperty;
            }
          ),
        })),
      };
      setJson(updatedJson);
    };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "utf-8");
      reader.onload = () => {
        const loadedJson = JSON.parse(reader.result as string);
        const updatedJson = {
          ...loadedJson,
          machines: loadedJson.machines.map((machine: Machine) => ({
            ...machine,
            observableProperties: machine.observableProperties.map(
              (observableProperty) => ({
                ...observableProperty,
                checked: false,
              })
            ),
          })),
        };
        setJson(updatedJson);
      };
    }
  };

  const createObservableProperties = () => {
    console.log("creating");
    setFinished(true)
    console.log(finished)
    setCreationStarted(true);
    const observablePropertiesToCreate =
      json?.machines?.[0]?.observableProperties?.filter(
        (observableProperty: any) => observableProperty.checked
      );
    console.log(observablePropertiesToCreate);

    observablePropertiesToCreate?.forEach((observableProperty: any) => {
      observableProperty.containingElement = json?.machines?.[0]?.id;
      observableProperty.connectionDetails = observableProperty.connectionDetails
      console.log(observableProperty)
      observableProperty.dataFormat = "RAW";
      console.log("creating", JSON.stringify(observableProperty));

      fetch(
        `${process.env.REACT_APP_MIDDLEWARE_URL}/api/Ingress/IngressFromFile?=`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, Content-Type, X-Auth-Token, X-Requested-With",
          },
          body: JSON.stringify(observableProperty),
        }
      )
        .then((response) => response.json())
        .then((data) =>
          console.log("created observableProperty: " + JSON.stringify(data))
        )
        .catch((error) => console.error(error));
    });

    createMachine(
      observablePropertiesToCreate?.map(
        (observableProperty: any) => observableProperty.id
      ) || []
    );
  };

  const createMachine = (propertyIds: string[]) => {
    try {
      console.log("creating machine", propertyIds)
      var createMachineDto = {
        id: json?.machines?.[0]?.id,
        name: json?.machines?.[0]?.name,
        description: json?.machines?.[0]?.description,
        parent: selectedContainer.id,
        type: "machine",
        children: [],
        observableProperties: propertyIds,
      };

      fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/ContainingElement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, Content-Type, X-Auth-Token, X-Requested-With",
        },
        body: JSON.stringify(createMachineDto),
      })
        .then((response) => response.json())
        .then((data) => console.log("created machine: " + JSON.stringify(data)))
        .catch((error) => console.error(error));

      var UpdateCelldto = {
        machineId: json?.machines?.[0]?.id,
        cellId: selectedContainer.id,
      };
      fetch(
        `${process.env.REACT_APP_MIDDLEWARE_URL}/api/ContainingElement/AddMachineToCell?=`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, Content-Type, X-Auth-Token, X-Requested-With",
          },
          body: JSON.stringify(UpdateCelldto),
        }
      )
        .then((response) => response.json())
        .then((data) => console.log("updated cell: " + JSON.stringify(data)))
        .catch((error) => console.error(error));
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleSnackbarClose = () => {
    setFinished(false);
  };

  return (
    <div>
      <Dialog
        open={PopupImport}
        onClose={handlerClose}
        scroll={"paper"}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle>Import one or more machines</DialogTitle>

        <DialogContent
          dividers={true}
          sx={{ overflow: "auto", maxHeight: "calc(100vh - 250px)" }}
        >
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>
          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep !== steps.length - 1 && (
                <Button onClick={handleNext}>{"Next"}</Button>
              )}
            </Box>
          </React.Fragment>
          {activeStep === 0 && (
            <>
              <Box
                sx={{
                  backgroundColor: "rgba(24, 85, 184, 0.9)",
                  border: "1px solid white",
                  p: 2,
                  marginLeft: "13px",
                  borderRadius: "10px",
                  marginRight: "13px",
                  color: "white",
                  alignItems: "center",
                  display: "flex",
                  "& p": {
                    marginLeft: "10px", // add some margin between the icon and the paragraph
                  },
                }}
              >
                <InfoIcon />
                <p>
                  Select the parent element in which you want to store your import machines
                </p>
              </Box>
              <Grid2 container spacing={2} sx={{ height: "60vh" }}>
                <Grid2
                  xs={5}
                  sx={{
                    marginTop: "30px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    borderRadius: "10px",
                    backgroundColor: "whitesmoke",
                  }}
                >

                  <Divider />
                  <IngressOverviewLeft
                    onItemClick={(parent: any) => {
                      setSelectedContainer(parent);
                    }}
                    filter={["cells"]}
                    initialSearchString={""}
                  />
                </Grid2>
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
                  <Box
                    display="inline-block"
                    borderRadius={3}
                    border="2px solid black"
                    padding={2}
                    maxWidth="100%"
                  >
                    <Typography variant="body1">
                      Selected Element: {selectedContainer?.name}
                    </Typography>
                  </Box>
                </Grid2>
              </Grid2>
            </>
          )}
          {activeStep === 1 && (
            <>
              <Grid2 container spacing={2} sx={{ height: "60vh" }}>
                <Grid2
                  xs={5}
                  sx={{
                    marginTop: "30px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    borderRadius: "10px",
                    backgroundColor: "whitesmoke",
                  }}
                >
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                  />
                </Grid2>
                <Grid2
                  xs={5}
                  sx={{
                    marginTop: "30px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    borderRadius: "10px",
                    backgroundColor: "whitesmoke",
                  }}
                >
                  <Typography variant="body2" gutterBottom>
                    {JSON.stringify(json, null, "\t")}
                  </Typography>
                </Grid2>
              </Grid2>
            </>
          )}
          {activeStep === 2 && (
            <>
              <Grid2 container spacing={2} sx={{ height: "60vh" }}>
                <Grid2
                  xs={5}
                  sx={{
                    marginTop: "30px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    borderRadius: "10px",
                    backgroundColor: "whitesmoke",
                  }}
                >
                  <FormControl
                    // required
                    // error={error}
                    component="fieldset"
                    sx={{ m: 3 }}
                    variant="standard"
                  >
                    <FormLabel component="legend">
                      Choose the Observable Properties to include
                    </FormLabel>
                    <FormGroup>
                      {json?.machines[0]?.observableProperties?.map(
                        (item: any, index: any) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                disabled={creationStarted}
                                checked={item.checked}
                                onChange={handleCheckboxChange(index)}
                              />
                            }
                            label={item.name}
                          />
                        )
                      )}
                    </FormGroup>
                    {/* <FormHelperText>You can display an error</FormHelperText> */}
                  </FormControl>
                  <Button
                    sx={{
                      marginLeft: 1,
                    }}
                    variant="outlined"
                    disableElevation
                    onClick={() => {
                      createObservableProperties();
                    }}
                  >
                    Create Observable Properties
                  </Button>
                  {finished && (
                    <Snackbar autoHideDuration={3000} onClose={handleSnackbarClose}>
                      <Alert onClose={handleSnackbarClose} severity="info">
                        Observable properties created!
                      </Alert>
                    </Snackbar>
                  )}

                </Grid2>
                <Grid2
                  xs={5}
                  sx={{
                    marginTop: "30px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    borderRadius: "10px",
                    backgroundColor: "whitesmoke",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    The Following Observable Properties have been created:
                  </Typography>
                  <List
                    dense={true}
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    subheader={
                      <ListSubheader>Observable Properties</ListSubheader>
                    }
                  >
                    {data?.observableProperties?.map((property: any) => (
                      <ListItemButton
                        key={property.name}
                        sx={{
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                      >
                        <ListItemIcon>
                          <SensorsIcon />
                        </ListItemIcon>
                        <ListItemText primary={property.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Grid2>
              </Grid2>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {/* <Button variant="outlined" color="primary" onClick={handlerClose}>
            Cancel
          </Button> */}
          <Button
            variant="contained"
            color="success"
            type="submit"
            onClick={handlerClose}
            disabled={activeStep !== steps.length - 1}
          >
            Finished
          </Button>

        </DialogActions>
      </Dialog>
    </div >
  );
};

export default ImportStepper;

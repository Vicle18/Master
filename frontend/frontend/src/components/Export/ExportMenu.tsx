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
} from "@mui/material";
import { isValid } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import SensorsIcon from "@mui/icons-material/Sensors";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Grid2 from "@mui/material/Unstable_Grid2";
import IngressOverviewLeft from "../Ingress/IngressOverviewLeft";
import { gql, useQuery } from "@apollo/client";

interface Props {}

const steps = ["Select Machines to export", "Copy or Download"];

const GET_MACHINES = gql`
  query Machines($where: MachineWhere) {
    machines(where: $where) {
      id
      name
      description
      observableProperties {
        changedFrequency
        description
        id
        frequency
        name
        topic {
          name
        }
        connectionDetails
        dataFormat
        dataType
        downsampleMethod
      }
    }
  }
`;

const ExportStepper: React.FC<Props> = ({}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [PopupExport, setPopupExport] = React.useState(false);
  const [currentlySelectedParent, setCurrentlySelectedParent] = useState<any>();
  const [selectedMachines, setSelectedMachines] = useState<any[]>();

  const { loading, error, data, refetch } = useQuery(GET_MACHINES, {
    variables: { where: { id: currentlySelectedParent?.id } },
  });
  //   if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  const handlerClose = () => {
    setActiveStep(0);
    setSelectedMachines([]);
    setPopupExport(false);
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
  const handleDelete = (element: any) => {
    setSelectedMachines(
      selectedMachines?.filter((node) => node.id !== element.id)
    );
  };

  const handleSave = () => {
    const element = document.createElement("a");
    var dataCopy = structuredClone(data);
    dataCopy.machines.forEach((machine: any) => {
      machine.observableProperties.forEach((observableProperty: any) => {
        observableProperty.topic = observableProperty.topic.name;
      });
    });
    const file = new Blob([JSON.stringify(dataCopy)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `${dataCopy.machines[0].name}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  return (
    <div>
      <Button
        sx={{
          marginLeft: 1,
        }}
        variant="outlined"
        disableElevation
        onClick={() => setPopupExport(true)}
      >
        Export Machines
      </Button>
      <Dialog
        open={PopupExport}
        onClose={handlerClose}
        scroll={"paper"}
        fullWidth={true}
        maxWidth={"lg"}
        sx={
          {
            // width: "80vw",
            //height: "80vh",
          }
        }
      >
        <DialogTitle>Export one or more machines</DialogTitle>

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
          <Box sx={{ height: "20px" }} />

          {activeStep === 0 && (
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
                  <Box mb={2}>
                    <Grid2 container alignItems="center" spacing={2}>
                      <Grid2 container xs={9}>
                        <Typography variant="caption">
                          Current Element: {currentlySelectedParent?.name}
                        </Typography>
                        {/* </Box> */}
                      </Grid2>
                      <Grid2 container xs={3}></Grid2>
                    </Grid2>
                  </Box>

                  <Divider />
                  <IngressOverviewLeft
                    onItemClick={(parent: any) => {
                      // HandleIngressClick(parent.name);
                      console.log("parent", parent);
                      setCurrentlySelectedParent(parent);
                      setSelectedMachines([parent]);
                    }}
                    filter={["machines"]}
                    initialSearchString={""}
                  />
                  <Divider />
                  <Button
                    sx={{ marginTop: "20px", marginLeft: "375px" }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      console.log("parents", currentlySelectedParent);
                      setSelectedMachines([
                        // ...selectedMachines?? [],
                        currentlySelectedParent,
                      ]);
                      console.log("refetching", currentlySelectedParent.id);
                      refetch({ where: { id: currentlySelectedParent.id } });
                    }}
                  >
                    Add
                  </Button>
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
                  <List
                    dense={true}
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    subheader={<ListSubheader>Machines</ListSubheader>}
                  >
                    {selectedMachines?.map((machine) => (
                      <ListItemButton
                        key={machine.id}
                        sx={{
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                      >
                        <ListItemIcon>
                          <SensorsIcon />
                        </ListItemIcon>
                        <ListItemText primary={machine.name} />
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(machine)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemButton>
                    ))}
                  </List>
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
                  <Typography
                    variant="body2"
                    gutterBottom
                    style={{ wordBreak: "break-all" }}
                  >
                    {JSON.stringify(data?.machines, null, "\t")}
                  </Typography>
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
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    onClick={handleSave}
                  >
                    Save as file
                  </Button>
                </Grid2>
              </Grid2>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {/* <Button variant="outlined" color="primary" onClick={handlerClose}>
            Cancel
          </Button> */}
          <Button variant="outlined" color="primary" onClick={handlerClose}>
            Cancel
          </Button>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>

          {activeStep !== steps.length - 1 && (
            <Button color="primary" variant="contained" onClick={handleNext}>
              {"Next"}
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <Button
              variant="contained"
              color="success"
              type="submit"
              onClick={handlerClose}
              disabled={activeStep !== steps.length - 1}
            >
              Finished
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExportStepper;

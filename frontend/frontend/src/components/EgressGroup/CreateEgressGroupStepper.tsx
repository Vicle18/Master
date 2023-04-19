import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Snackbar,
  Step,
  StepButton,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SensorsIcon from "@mui/icons-material/Sensors";
import { Formik, Form, Field, FieldProps, useFormikContext } from "formik";
import * as Yup from "yup";
import Grid2 from "@mui/material/Unstable_Grid2";

import { initialValues, validationSchema, FormData } from "./FormDefinition";
import DetailedView from "../Ingress/IngressDetailed";
import IngressOverviewLeft from "../Ingress/IngressOverviewLeft";
import EgressGroupsSearchResults from "../Egress/EgressGroupsSearchResults";

interface Props {
  setPopupEgressGroup: React.Dispatch<React.SetStateAction<boolean>>;
  PopupEgressGroup: boolean;
  handleResult: (result: string) => void;
}

const steps = ["Define Meta data", "Select Egress Endpoints"];

const CreateEgressGroupStepper: React.FC<Props> = ({
  setPopupEgressGroup,
  PopupEgressGroup,
  handleResult,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [egressNodes, setEgressNodes] = useState<any[]>([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handlerClose = () => {
    setPopupEgressGroup(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (values: FormData) => {
    console.log("submit", values, egressNodes);
    values.egressEndpointIds = egressNodes.map((node) => node.id);
    setPopupEgressGroup(false);
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers":
        "Origin, Content-Type, X-Auth-Token, X-Requested-With",
    };

    fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/EgressGroup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, Content-Type, X-Auth-Token, X-Requested-With",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => console.log("data: " + data))
      .catch((error) => console.error(error));
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleSelectEgressNode = (egressEndpoint: any) => {
    console.log("egressnode", egressEndpoint);
    if(egressNodes.find((node) => node.id === egressEndpoint.id)) return;
    setEgressNodes([...egressNodes, egressEndpoint]);
  };
  const handleDelete = (element: any) => {
    setEgressNodes(egressNodes.filter((node) => node.id !== element.id));
  };

  return (
    <div>
      <Dialog
        open={PopupEgressGroup}
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldValue,
            isValid,
          }) => (
            <Form onSubmit={handleSubmit}>
              <DialogTitle>Create an Egress Group</DialogTitle>
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
                    <Field name="name">
                      {({ field }: FieldProps<FormData>) => (
                        <TextField
                          {...field}
                          label="Name"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          size="small"
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    </Field>
                    <Field name="description">
                      {({ field }: FieldProps<FormData>) => (
                        <TextField
                          {...field}
                          label="Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          maxRows={4}
                          margin="normal"
                          size="small"
                          error={
                            touched.description && Boolean(errors.description)
                          }
                          helperText={touched.description && errors.description}
                        />
                      )}
                    </Field>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Grid2 container spacing={2} sx={{ height: "60vh" }}>
                      
                      <Grid2
                        xs={6}
                        sx={{
                          marginTop: "30px",
                          marginRight: "50px",
                          borderRadius: "10px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <EgressGroupsSearchResults
                          onSelectEgress={handleSelectEgressNode}
                        />
                      </Grid2>
                      <Grid2
                        xs={3}
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
                          subheader={
                            <ListSubheader>Egress Endpoints</ListSubheader>
                          }
                        >
                          {egressNodes.map((node:any) => (
                            <ListItemButton
                              key={node.id}
                              sx={{
                                "&:hover": { backgroundColor: "#f0f0f0" },
                              }}
                            >
                              <ListItemIcon>
                                <SensorsIcon />
                              </ListItemIcon>
                              <ListItemText primary={node.name} />
                              <IconButton
                                edge="end"
                                onClick={() => handleDelete(node)}
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
              </DialogContent>
              <DialogActions>
                {errors.name && (
                  <div>
                    <Chip
                      label={errors.name}
                      color="error"
                      variant="outlined"
                    />
                  </div>
                )}
                {errors.description && (
                  <div>
                    <Chip
                      label={errors.description}
                      color="error"
                      variant="outlined"
                    />
                  </div>
                )}

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handlerClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  disabled={!isValid}
                >
                  Create
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};
export default CreateEgressGroupStepper;

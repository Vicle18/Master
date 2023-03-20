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
import IngressOverviewLeft from "../IngressOverviewLeft";

interface Props {
  setPopupIngress: React.Dispatch<React.SetStateAction<boolean>>;
  PopupIngress: boolean;
  handleResult: (result: string) => void;
}

const steps = [
  "Define Ingress Endpoint",
  "Select Containing Element",
  "Test Connection",
];

const CreateIngressStepper: React.FC<Props> = ({
  setPopupIngress,
  PopupIngress,
  handleResult,
}) => {
  const [result, setResult] = useState<string | null>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedIngressNode, setSelectedIngressNode] = useState<string>("");
  const [selectedChild, setSelectedChild] = useState<string>("");

  const [selectedContainingElement, setSelectedParent] = useState<string>("");
  const [selectedIngress, setSelectedIngress] = useState<string>("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handlerClose = () => {
    setPopupIngress(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (values: FormData) => {
    console.log("submit", values);
    setPopupIngress(false);

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers":
        "Origin, Content-Type, X-Auth-Token, X-Requested-With",
    };

    axios
      .get(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/Ingress`, { headers })
      .then((response) => {
        console.log(response.data);
        setResult(response.data);
        handleResult(response.data);
      })
      .catch((error) => {
        console.error(error);
        setResult(error.message);
        handleResult(error.message);
      });

    fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/Ingress?=`, {
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

  function HandleIngressClick(data: any): void {
    setSelectedIngress(data);
    console.log("selected containing element", data);
  }
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <div>
      <Dialog
        open={PopupIngress}
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
              <DialogTitle>Create a Containing Element</DialogTitle>
              <DialogContent
                dividers={true}
                sx={{ overflow: "auto", maxHeight: "calc(100vh - 250px)" }}
              >
                {/* <DialogContentText>
                  To create an Ingress endpoint, please enter the following
                  information.
                </DialogContentText> */}
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
                    {/* <Button onClick={handleNext} >
                      {activeStep === steps.length - 1 ? "" : "Next"}
                    </Button> */}
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
                    <FormControl variant="outlined" fullWidth margin="normal">
                      <InputLabel id="protocol-label">Protocol</InputLabel>
                      <Field
                        as={Select}
                        name="protocol"
                        labelId="protocol-label"
                        label="Protocol"
                        size="small"
                      >
                        <MenuItem value="MQTT">MQTT</MenuItem>
                        <MenuItem value="OPCUA">OPCUA</MenuItem>
                      </Field>
                    </FormControl>
                    {values.protocol === "MQTT" ? (
                      <>
                        <Field name="host">
                          {({ field }: FieldProps<FormData>) => (
                            <TextField
                              {...field}
                              label="Host"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              size="small"
                              error={touched.host && Boolean(errors.host)}
                              helperText={touched.host && errors.host}
                            />
                          )}
                        </Field>
                        <Field name="port">
                          {({ field }: FieldProps<FormData>) => (
                            <TextField
                              {...field}
                              label="Port"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              size="small"
                              error={touched.port && Boolean(errors.port)}
                              helperText={touched.port && errors.port}
                            />
                          )}
                        </Field>
                        <Field name="topic">
                          {({ field }: FieldProps<FormData>) => (
                            <TextField
                              {...field}
                              label="Topic"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              size="small"
                              error={touched.topic && Boolean(errors.topic)}
                              helperText={touched.topic && errors.topic}
                            />
                          )}
                        </Field>
                      </>
                    ) : (
                      <Field name="nodeId">
                        {({ field }: FieldProps<FormData>) => (
                          <TextField
                            {...field}
                            label="Node ID"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            size="small"
                            error={touched.nodeId && Boolean(errors.nodeId)}
                            helperText={touched.nodeId && errors.nodeId}
                          />
                        )}
                      </Field>
                    )}
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
                        <Box mb={2}>
                          <Grid2 container alignItems="center" spacing={2}>
                            <Grid2 container xs={9}>
                              <Box
                                display="inline-block"
                                borderRadius={3}
                                border="2px solid black"
                                padding={2}
                                maxWidth="100%"
                              >
                                <Typography variant="body1">
                                  Current Element: {selectedContainingElement}
                                </Typography>
                              </Box>
                            </Grid2>
                            <Grid2 container xs={3}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  values.containingElement =
                                    selectedContainingElement;
                                }}
                              >
                                SELECT
                              </Button>
                            </Grid2>
                          </Grid2>
                        </Box>

                        <Divider />
                        <IngressOverviewLeft
                          onItemClick={(parent: string) => {
                            HandleIngressClick(parent);
                            setSelectedParent(parent);
                            console.log("parent", values.containingElement);
                          }}
                        />
                      </Grid2>
                      <Grid2
                        xs={3}
                        sx={{
                          marginTop: "30px",
                          marginLeft: "20px",
                          marginRight: "20px",
                          borderRadius: "10px",
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
                            Selected Element: {values.containingElement}
                          </Typography>
                        </Box>
                      </Grid2>
                    </Grid2>
                  </>
                )}

                {activeStep === 2 && ( //children
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
                      ></Grid2>
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
export default CreateIngressStepper;

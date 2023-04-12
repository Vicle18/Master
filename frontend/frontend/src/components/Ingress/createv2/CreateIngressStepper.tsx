import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
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
interface CheckBoxData {
  [key: string]: boolean;
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

  const [currentlySelectedParent, setCurrentlySelectedParent] =
    useState<string>("");
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [selectedMetadata, setSelectedMetadata] = useState<string>("");
  const [selectedIngress, setSelectedIngress] = useState<string>("");
  const [checkBoxData, setCheckBoxData] = useState<CheckBoxData>({});
  const theme = useTheme();
  const handlerClose = () => {
    setPopupIngress(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleChangeMetadata = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    console.log(name, checked);
    console.log(JSON.stringify(checkBoxData));
    setCheckBoxData({ ...checkBoxData, [name]: checked });
  };

  const handleSubmit = (values: FormData) => {
    console.log("submit", values);
    setPopupIngress(false);
    if (values.dataFormat === "WITH_METADATA") {
      values.metadata = {};
      for (const [key, value] of Object.entries(checkBoxData)) {
        if (value) {
          switch (key) {
            case "timestamp":
              values.metadata!.timestamp = true;
              break;
            case "name":
              values.metadata!.name = values.name;
              break;
            case "description":
              values.metadata!.description = values.description;
              break;
            case "frequency":
              values.metadata!.frequency = values.frequency;
              break;
          }
        }
      }
    }
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
              <DialogTitle>Create an observable property</DialogTitle>

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
                        <MenuItem value="RTDE">RTDE</MenuItem>
                      </Field>
                    </FormControl>
                    {(values.protocol === "MQTT" ||
                      values.protocol === "RTDE") && (
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
                        </>
                      )}
                    {values.protocol === "MQTT" && (
                      <>
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
                    )}
                    {values.protocol === "RTDE" && (
                      <>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        >
                          <InputLabel id="output-label">Output</InputLabel>
                          <Field
                            as={Select}
                            name="output"
                            labelId="output-label"
                            label="Output"
                            size="small"
                          >
                            <MenuItem value="timestamp">Timestamp</MenuItem>
                            <MenuItem value="actual_q">Actual q</MenuItem>
                            <MenuItem value="joint_temperatures">
                              Joint Temperatures
                            </MenuItem>
                            <MenuItem value="robot_mode">Robot Mode</MenuItem>
                          </Field>
                        </FormControl>
                      </>
                    )}
                    {values.protocol === "OPCUA" && (
                      <>
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
                      </>
                    )}

                    <Field name="frequency">
                      {({ field }: FieldProps<FormData>) => (
                        <TextField
                          {...field}
                          label="Frequency"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          size="small"
                          error={touched.frequency && Boolean(errors.frequency)}
                          helperText={touched.frequency && errors.frequency}
                        />
                      )}
                    </Field>
                    <Field name="changedFrequency">
                      {({ field }: FieldProps<FormData>) => (
                        <TextField
                          {...field}
                          label="Changed Frequency"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          size="small"
                          error={
                            touched.changedFrequency &&
                            Boolean(errors.changedFrequency)
                          }
                          helperText={
                            touched.changedFrequency && errors.changedFrequency
                          }
                        />
                      )}
                    </Field>
                    <FormControl variant="outlined" fullWidth margin="normal">
                      <InputLabel id="dataFormat-label">Data Format</InputLabel>
                      <Field
                        as={Select}
                        name="dataFormat"
                        labelId="dataFormat-label"
                        label="Data Format"
                        size="small"
                      >
                        <MenuItem value="RAW">Raw</MenuItem>
                        <MenuItem value="WITH_METADATA">With Metadata</MenuItem>
                        ={" "}
                      </Field>
                    </FormControl>
                    {values.dataFormat === "WITH_METADATA" && (
                      <>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkBoxData.timestamp || false}
                                onChange={handleChangeMetadata}
                                name="timestamp"
                              />
                            }
                            label="Timestamp"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkBoxData.name || false}
                                onChange={handleChangeMetadata}
                                name="name"
                              />
                            }
                            label="Name"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkBoxData.description || false}
                                onChange={handleChangeMetadata}
                                name="description"
                              />
                            }
                            label="Description"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkBoxData.frequency || false}
                                onChange={handleChangeMetadata}
                                name="frequency"
                              />
                            }
                            label="Frequency"
                          />
                        </FormGroup>
                      </>
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
                              {/* <Box
                                display="inline-block"
                                borderRadius={3}
                                border="2px solid black"
                                padding={2}
                                maxWidth="100%"
                              > */}
                              <Typography variant="caption">
                                Current Element: {currentlySelectedParent}
                              </Typography>
                              {/* </Box> */}
                            </Grid2>
                            <Grid2 container xs={3}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  values.containingElement =
                                    currentlySelectedParent;
                                  setSelectedParent(currentlySelectedParent);
                                }}
                              >
                                SELECT
                              </Button>
                            </Grid2>
                          </Grid2>
                        </Box>

                        <Divider />
                        <IngressOverviewLeft
                          onItemClick={(parent: any) => {
                            HandleIngressClick(parent.name);
                            setCurrentlySelectedParent(parent.name);
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
                            Selected Element: {selectedParent}
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

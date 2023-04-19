import React, { ChangeEvent, useState } from "react";
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
  FormLabel,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Radio,
  Select,
  Snackbar,
  Step,
  StepButton,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoIcon from "@mui/icons-material/Info";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";

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
  // "Test Connection",
];

const CreateIngressStepper: React.FC<Props> = ({
  setPopupIngress,
  PopupIngress,
  handleResult,
}) => {
  const [result, setResult] = useState<string | null>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [radioValue, setRadioValue] = useState("");
  const [currentlySelectedParent, setCurrentlySelectedParent] =
    useState<string>("");
  const [selectedParent, setSelectedParent] = useState<string>(
    initialValues.containingElement ?? ""
  );
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

  function handleRadioButtonChange(
    event: ChangeEvent<HTMLInputElement>,
    value: string
  ): void {
    setRadioValue(event.target.value);
  }

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
                {/* Here we create some vertical space */}
                <Box sx={{ height: "20px" }} />
                
                {activeStep === 0 && (
                  <>
                    <Field name="name">
                      {({ field }: FieldProps<FormData>) => (
                        <TextField
                          {...field}
                          label="Name"
                          variant="outlined"
                          style={{
                            width: "calc(100% - 40px)",
                            marginRight: "10px",
                          }}
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
                          style={{
                            width: "calc(100% - 40px)",
                            marginRight: "10px",
                          }}
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
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <FormControl
                        variant="outlined"
                        margin="normal"
                        style={{
                          width: "calc(100% - 40px)",
                          marginRight: "10px",
                        }}
                      >
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
                      <Tooltip title="Please select the protocol you want to use, for instance RTDE to extract data from a UR.">
                        <IconButton sx={{ marginTop: "10px" }}>
                          <HelpOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {(values.protocol === "MQTT" ||
                      values.protocol === "RTDE") && (
                      <>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
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
                          <Tooltip title="Please provide a valid host such as 127.0.0.1">
                            <IconButton sx={{ marginTop: "10px" }}>
                              <HelpOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
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
                          <Tooltip title="Please provide a valid port number, such as 8080.">
                            <IconButton sx={{ marginTop: "10px" }}>
                              <HelpOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    )}
                    {values.protocol === "MQTT" && (
                      <>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
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
                          <Tooltip title="Please provide a name for the location where data uploads will be stored.">
                            <IconButton sx={{ marginTop: "10px" }}>
                              <HelpOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    )}
                    {values.protocol === "RTDE" && (
                      <>
                        <FormControl
                          variant="outlined"
                          style={{
                            width: "calc(100% - 40px)",
                            marginRight: "10px",
                          }}
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
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
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
                          <Tooltip title="Please provide an ID for the OPC UA broker.">
                            <IconButton sx={{ marginTop: "10px" }}>
                              <HelpOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    )}
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Field name="frequency">
                        {({ field }: FieldProps<FormData>) => (
                          <TextField
                            {...field}
                            label="Frequency (Hz)"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            size="small"
                            error={
                              touched.frequency && Boolean(errors.frequency)
                            }
                            helperText={touched.frequency && errors.frequency}
                          />
                        )}
                      </Field>
                      <Tooltip title="Please provide the data upload frequency as a number">
                        <IconButton sx={{ marginTop: "10px" }}>
                          <HelpOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Field name="changedFrequency">
                        {({ field }: FieldProps<FormData>) => (
                          <TextField
                            {...field}
                            label="Changed Frequency (Hz)"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            size="small"
                            error={
                              touched.changedFrequency &&
                              Boolean(errors.changedFrequency)
                            }
                            helperText={
                              touched.changedFrequency &&
                              errors.changedFrequency
                            }
                          />
                        )}
                      </Field>
                      <Tooltip title="Changed frequency helps you reduce the current frequency">
                        <IconButton sx={{ marginTop: "10px" }}>
                          <HelpOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <FormControl
                        variant="outlined"
                        margin="normal"
                        style={{
                          width: "calc(100% - 40px)",
                          marginRight: "10px",
                        }}
                      >
                        <InputLabel id="datatype-label">Data Type</InputLabel>
                        <Field
                          as={Select}
                          name="dataType"
                          labelId="dataType-label"
                          label="dataType"
                          size="small"
                        >
                          <MenuItem value="NUMBER">NUMBER</MenuItem>
                          <MenuItem value="STRING">STRING</MenuItem>
                          <MenuItem value="ARRAY">ARRAY</MenuItem>
                        </Field>
                      </FormControl>
                      <Tooltip title="Define what kind of data is arriving. For simple sensors, its often just a number, for other software it might be more text.">
                        <IconButton sx={{ marginTop: "10px" }}>
                          <HelpOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {values?.changedFrequency &&
                      values.frequency > values?.changedFrequency && (
                        <>
                          <FormControl
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          >
                            <Box
                              sx={{
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              <InputLabel id="downsampleMethod-label">
                                Downsample Method
                              </InputLabel>
                              <Field
                                as={Select}
                                name="downsampleMethod"
                                fullWidth
                                labelId="downsampleMethod-label"
                                label="downsampleMethod"
                                size="small"
                              >
                                {(values.dataType === "String" ||
                                  values.dataType === "Array") && (
                                  <MenuItem value="ACCUMULATED">
                                    Accumulated
                                  </MenuItem>
                                )}
                                {(values.dataType === "String" ||
                                  values.dataType === "Array" ||
                                  values.dataType === "Number") && (
                                  <MenuItem value="LATEST">Latest</MenuItem>
                                )}
                                {values.dataType === "Number" && (
                                  <MenuItem value="AVERAGE">Average</MenuItem>
                                )}
                                {values.dataType === "Number" && (
                                  <MenuItem value="MEDIAN">Median</MenuItem>
                                )}
                              </Field>
                              <Tooltip title="Please specify how you wish to downsample the data">
                                <IconButton>
                                  <HelpOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </FormControl>
                        </>
                      )}
                  </>
                )}
                {activeStep === 1 && (
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
                        Select the Containing Element in which you would like to
                        store your Ingress Endpoint. For instance, which machine
                        or cell the observable property is related to.
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
                            // HandleIngressClick(parent.name);
                            // setCurrentlySelectedParent(parent.name);
                            // console.log("parent", values.containingElement);
                            values.containingElement = parent.name;
                            setSelectedParent(parent.name);
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
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>

                {activeStep !== steps.length - 1 && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleNext}
                  >
                    {"Next"}
                  </Button>
                )}
                {activeStep === steps.length - 1 && (
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    disabled={!isValid || activeStep != 1}
                  >
                    Create
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};
export default CreateIngressStepper;

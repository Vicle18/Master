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
import Grid2 from "@mui/material/Unstable_Grid2";
import { initialValues, validationSchema, FormData } from "../createv2/FormDefinition";
import { previousPropertyValues } from "../IngressDetailed";

interface Props {
  setPopupIngress: React.Dispatch<React.SetStateAction<boolean>>;
  PopupIngress: boolean;
  handleResult: (result: string) => void;
}

const steps = [
  "Edit Ingress Endpoint Values",
  "Inspect Changes",
];

const EditIngressStepper: React.FC<Props> = ({
  setPopupIngress,
  PopupIngress,
  handleResult,
}) => {
  const [result, setResult] = useState<string | null>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedIngress, setSelectedIngress] = useState<string>("");
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

    fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/Ingress/update?=`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
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
                    <Field name="dataFormat">
                      {({ field }: FieldProps<FormData>) => (
                        <TextField
                          {...field}
                          label="Data Format"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          size="small"
                          error={
                            touched.dataFormat && Boolean(errors.dataFormat)
                          }
                          helperText={touched.dataFormat && errors.dataFormat}
                        />
                      )}
                    </Field>
                  </>
                )}
                {activeStep === 1 && ( //children
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
                        <Typography variant="h6" gutterBottom textAlign={"center"} color={"grey"}>
                          Previous Specifications
                        </Typography>
                        <Field name="name">
                          {({ field }: FieldProps<FormData>) => (
                            <TextField
                              {...field}
                              label="Name"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              size="small"
                              value={previousPropertyValues.name}
                              disabled
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
                              value={previousPropertyValues.description}
                              disabled
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
                            disabled
                            value={JSON.parse(previousPropertyValues.connectionDetails).PROTOCOL}
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
                                    disabled
                                    value={JSON.parse(previousPropertyValues.connectionDetails).PARAMETERS.HOST}
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
                                    disabled
                                    value={JSON.parse(previousPropertyValues.connectionDetails).PARAMETERS.PORT}
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
                                  disabled
                                  margin="normal"
                                  size="small"
                                  value={previousPropertyValues.topic}
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
                              disabled
                              margin="normal"
                            >
                              <InputLabel id="output-label">Output</InputLabel>
                              <Field
                                as={Select}
                                name="output"
                                labelId="output-label"
                                label="Output"
                                disabled
                                value={JSON.parse(previousPropertyValues.connectionDetails).PARAMETERS.OUTPUT}
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
                                  value={JSON.parse(previousPropertyValues.connectionDetails).PARAMETERS.NODEID}
                                  disabled
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
                              value={previousPropertyValues.frequency}
                              disabled
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
                              value={previousPropertyValues.changedFrequency}
                              disabled
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
                        <Field name="dataFormat">
                          {({ field }: FieldProps<FormData>) => (
                            <TextField
                              {...field}
                              label="Data Format"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              size="small"
                              value={previousPropertyValues.dataFormat}
                              disabled
                              error={
                                touched.dataFormat && Boolean(errors.dataFormat)
                              }
                              helperText={touched.dataFormat && errors.dataFormat}
                            />
                          )}
                        </Field>
                      </Grid2>
                      <Grid2
                        xs={5}
                        sx={{
                          marginTop: "30px",
                          marginLeft: "20px",
                          marginRight: "20px",
                          borderRadius: "10px",
                          backgroundColor: "whitesmoke",
                        }}>
                        <Typography variant="h6" gutterBottom textAlign={"center"} color={"grey"}>
                          Changed Specifications
                        </Typography>
                        <Field name="name">
                          {({ field }: FieldProps<FormData>) => (
                            <TextField
                              {...field}
                              label="Name"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              size="small"
                              disabled
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
                              disabled
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
                            disabled
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
                                    disabled
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
                                    disabled
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
                                  disabled
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
                              disabled
                              margin="normal"
                            >
                              <InputLabel id="output-label">Output</InputLabel>
                              <Field
                                as={Select}
                                name="output"
                                labelId="output-label"
                                label="Output"
                                disabled
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
                                  disabled
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
                              disabled
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
                              disabled
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
                        <Field name="dataFormat">
                          {({ field }: FieldProps<FormData>) => (
                            <TextField
                              {...field}
                              label="Data Format"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              size="small"
                              disabled
                              error={
                                touched.dataFormat && Boolean(errors.dataFormat)
                              }
                              helperText={touched.dataFormat && errors.dataFormat}
                            />
                          )}
                        </Field>
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
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};
export default EditIngressStepper;

import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
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
  Slide,
  Snackbar,
  Step,
  StepButton,
  StepContent,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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
  const [openSnackbar, setOpenSnackbar] = React.useState(true);
  const [checked, setChecked] = React.useState(false);

  const theme = useTheme();
  
  const handleResultInSnackbar = (result: string) => {
    console.log(`Result for snackbar: ${result}`);
    setResult(result);
    setOpenSnackbar(true);
    console.log(openSnackbar);
  };
  const handlerClose = () => {
    setActiveStep(0)

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
    setActiveStep(0)

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
        handleResultInSnackbar(response.data);

      })
      .catch((error) => {
        console.error(error);
        setResult(error.message);
        handleResultInSnackbar(error.message);
      });

    console.log(values)
    console.log(JSON.stringify(values))
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

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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

                    <Box sx={{ flex: "1 1 auto" }} />

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
                          style={{ width: 'calc(100% - 40px)', marginRight: '10px' }}
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
                          style={{ width: 'calc(100% - 40px)', marginRight: '10px' }}
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
                        style={{ width: 'calc(100% - 40px)', marginRight: '10px' }}
                      >
                        <MenuItem value="MQTT">MQTT</MenuItem>
                        <MenuItem value="OPCUA">OPCUA</MenuItem>
                        <MenuItem value="RTDE">RTDE</MenuItem>
                      </Field>
                    </FormControl>
                    {(values.protocol === "MQTT" ||
                      values.protocol === "RTDE") && (
                        <>
                          <Box sx={{
                            alignItems: "center",
                            display: "flex",
                          }}>
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
                          <Box sx={{
                            alignItems: "center",
                            display: "flex",
                          }}>
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
                        <Box sx={{
                          alignItems: "center",
                          display: "flex",
                        }}>
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
                          fullWidth
                          margin="normal"
                        >
                          <InputLabel id="output-label">Output</InputLabel>
                          <Field
                            as={Select}
                            name="output"
                            labelId="output-label"
                            label="output"
                            size="small"
                            style={{ width: 'calc(100% - 40px)', marginRight: '10px' }}
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
                        <Box sx={{
                          alignItems: "center",
                          display: "flex",
                        }}>
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
                          <Tooltip title="Please provide an ID for the OPC UA broker">
                            <IconButton sx={{ marginTop: "10px" }}>
                              <HelpOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    )}
                    <Box sx={{
                      alignItems: "center",
                      display: "flex",
                    }}>
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
                      <Tooltip title="Please provide the data upload frequency as a number">
                        <IconButton sx={{ marginTop: "10px" }}>
                          <HelpOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch checked={checked} onChange={handleSwitchChange} name="switch" />
                        }
                        label="Reduce the standard frequency"
                      />
                    </FormGroup>
                    {checked && (
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
                              label="Reduced Frequency (Hz)"
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
                    )}
                    <FormControl variant="outlined" margin="normal" style={{ width: 'calc(100% - 40px)', marginRight: '10px' }}>
                      <InputLabel id="dataType-label">Data Type</InputLabel>
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
                    {values?.changedFrequency && (values.frequency > values?.changedFrequency) && (
                      <>
                        <FormControl variant="outlined" margin="normal" fullWidth>
                          <Box sx={{
                            alignItems: "center",
                            display: "flex",
                          }}>
                            <InputLabel id="downsampleMethod-label">Downsample Method</InputLabel>
                            <Field
                              as={Select}
                              name="downsampleMethod"
                              fullWidth
                              labelId="downsampleMethod-label"
                              label="downsampleMethod"
                              size="small"
                            >
                              {(values.dataType === "STRING" || values.dataType === "ARRAY") && (
                                <MenuItem value="Accumulated">Accumulated</MenuItem>
                              )}
                              {(values.dataType === "STRING" || values.dataType === "ARRAY" || values.dataType === "NUMBER") && (
                                <MenuItem value="Latest">Latest</MenuItem>
                              )}
                              {(values.dataType === "NUMBER") && (
                                <MenuItem value="Average">Average</MenuItem>
                              )}
                              {(values.dataType === "NUMBER") && (
                                <MenuItem value="Median">Median</MenuItem>
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
                            value={previousPropertyValues.protocol}
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
                                    value={previousPropertyValues.host}
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
                                    value={previousPropertyValues.port}
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
                                  value={previousPropertyValues.topic.name}
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
                                label="output"
                                disabled
                                value={previousPropertyValues.output}
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
                                  value={JSON.parse(previousPropertyValues.nodeId)}
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
                              value={previousPropertyValues.changedFrequency}
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
                                label="output"
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
      {result && (<Snackbar
          open={true}
          onClose={handleCloseSnackbar}
          autoHideDuration={3000}
          TransitionComponent={Slide}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          message={result}
        >
          {result === "Network Error" ? (
            <Alert
              // onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              {result}
            </Alert>
          ) : (
            <Alert
              // onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              {
                "Ingress Endpoint successfully created. You can now work with the data."
              }
            </Alert>
          )}
          
          
        </Snackbar>)}
    </div>
  );
};
export default EditIngressStepper;

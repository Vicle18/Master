import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Step,
  StepButton,
  Stepper,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SensorsIcon from "@mui/icons-material/Sensors";
import { Formik, Form, Field, FieldProps, FieldArray } from "formik";
import Grid2 from "@mui/material/Unstable_Grid2";
import DetailedView from "../../Ingress/IngressDetailed";
import IngressOverviewLeft from "../../Ingress/IngressOverviewLeft";
import {
  initialValues,
  validationSchema,
  FormData,
  ingressNode,
} from "./FormDefinition";

interface Props {
  setPopupEgress: React.Dispatch<React.SetStateAction<boolean>>;
  PopupEgress: boolean;
  handleResult: (result: string) => void;
}

const steps = [
  "Setup Endpoint Information",
  "Add Observable Properties",
  "Select Frequency",
  "Access Information",
];

const CreateEgressStepper: React.FC<Props> = ({
  setPopupEgress,
  PopupEgress,
  handleResult,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [createBroker, setCreateBroker] = React.useState<boolean>(false);

  const [ingressNodes, setIngressNodes] = useState<ingressNode[]>([]);
  const [selectedIngressNode, setSelectedIngressNode] = useState<string>("");
  const [selectedEgress, setSelectedEgress] =
    useState<string>("");
  const [selectedDataFormat, setSelectedDataFormat] = useState<string>("string");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handlerClose = () => {
    setPopupEgress(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (values: FormData) => {
    console.log("submit", values, ingressNodes);
    setPopupEgress(false);
    values.ingressIds = ingressNodes?.map((node: ingressNode) => node.id);
    values.createBroker = !createBroker;
    values.frequencies = ingressNodes.map((node: ingressNode) => node.frequency) || [];
    values.changedFrequencies = ingressNodes.map((node: ingressNode) => node.changedFrequency) || [];
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers":
        "Origin, Content-Type, X-Auth-Token, X-Requested-With",
    };

    console.log(JSON.stringify(values));


    fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/Egress?=`, {
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
      .then((data) => console.log("data: " + JSON.stringify(data)))
      .catch((error) => console.error(error));
  };

  function handleEgressClick(data: any): void {
    setSelectedEgress(data.name);
  }

  const handleSelectObservableProperty = (observableProperty: any) => {
    console.log("observable property", observableProperty);
    setSelectedIngressNode(observableProperty);
    setIngressNodes([...ingressNodes, observableProperty]);
  };
  const handleDelete = (element: ingressNode) => {
    setIngressNodes(ingressNodes.filter((node) => node.id !== element.id));
  };
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  return (
    <div>
      <Dialog
        open={PopupEgress}
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
              <DialogTitle>Create an Egress Endpoint</DialogTitle>
              <DialogContent
                dividers={true}
                sx={{ overflow: "auto", maxHeight: "calc(100vh - 250px)" }}
              >
                {/* <DialogContentText>
                To create an Egress endpoint, please enter the following
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
                      <InputLabel id="dataFormat-label">Protocol</InputLabel>
                      <Field
                        as={Select}
                        name="dataFormat"
                        labelId="dataFormat-label"
                        label="dataFormat"
                        size="small"
                      >
                        <MenuItem value="string">String</MenuItem>
                        <MenuItem value="raw">Raw</MenuItem>
                        <MenuItem value="json">Json</MenuItem>
                      </Field>
                    </FormControl>
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

                    {(values.protocol === "MQTT" || values.protocol === "OPCUA") && (
                      <>
                      <Field name="createBroker">
                          {({ field }: FieldProps<FormData>) => (
                            <FormControlLabel control={<Switch
                              {...field}
                              defaultChecked={values.createBroker}
                              onChange={() =>{
                                values.createBroker = !values.createBroker
                                console.log(values.createBroker);
                                setCreateBroker(values.createBroker);
                              }
                              
                              }
                              disabled = {values.protocol === "OPCUA"}
                              color="primary"
                            />} label="Providing your own broker" />
                            
                          )}
                        </Field>
                        </>)}

                    {createBroker &&  values.protocol === "MQTT" && (
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
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Grid2 container spacing={2} sx={{ height: "60vh" }}>
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
                          subheader={
                            <ListSubheader>Observable Properties</ListSubheader>
                          }
                        >
                          {ingressNodes.map((node) => (
                            <ListItemButton
                              key={node.name}
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
                      <Grid2
                        xs={3.6}
                        sx={{
                          marginTop: "30px",
                          marginRight: "20px",
                          borderRadius: "10px",

                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <IngressOverviewLeft onItemClick={handleEgressClick} />
                      </Grid2>
                      <Grid2
                        xs={4.3}
                        sx={{
                          marginTop: "30px",
                          marginRight: "50px",
                          borderRadius: "10px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <DetailedView
                          containingEntityId={selectedEgress}
                          onOpenChart={handleSelectObservableProperty}
                          withDetails={false}
                        />
                      </Grid2>
                    </Grid2>
                  </>
                )}
                {activeStep === 2 && (
                  <FieldArray
                    name="data"
                    render={(arrayHelpers) => (
                      <>
                        {ingressNodes.map(
                          (data: ingressNode, index: number) => (
                            <Grid2
                              container
                              spacing={2}
                              key={data.id}
                              sx={{ marginTop: "10px", marginBottom: "10px"}}
                            >
                              <Grid2 container xs={6}>
                                <TextField
                                  label="Name"
                                  value={data.name}
                                  disabled
                                  size="small"

                                />
                              </Grid2>
                              <Grid2 container xs={3}>
                                <TextField
                                  label="Original Frequency"
                                  value={data.frequency}
                                  disabled
                                  size="small"

                                />
                              </Grid2>
                              <Grid2 container xs={3}>
                                <TextField
                                  label="New Frequency"
                                  // value={
                                  //   ingressNodes[index].frequency
                                  // }
                                  onChange={(e) => {
                                    ingressNodes[index].changedFrequency = +e.target.value;

                                  }}
                                  size="small"
                                  // name={`data[${index}].frequency`}
                                />
                              </Grid2>
                            </Grid2>
                          )
                        )}
                      </>
                    )}
                  />
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
                {errors.host && (
                  <div>
                    <Chip
                      label={errors.host}
                      color="error"
                      variant="outlined"
                    />
                  </div>
                )}
                {ingressNodes.length < 1 && (
                  <div>
                    <Chip
                      label={"At least one observable property is required"}
                      color="error"
                      variant="outlined"
                    />
                  </div>
                )}
                {errors.port && (
                  <div>
                    <Chip
                      label={errors.port}
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
                  disabled={!(isValid && ingressNodes.length > 0)}
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
export default CreateEgressStepper;

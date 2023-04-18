import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Step,
  StepButton,
  Stepper,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
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
interface CheckBoxData {
  [key: string]: boolean;
}
const steps = [
  "Setup Endpoint Information",
  "Add Observable Properties",
  "Select Frequency",
  "Select Endpoint Group",
  "Access Information",
];

const CreateEgressStepper: React.FC<Props> = ({
  setPopupEgress,
  PopupEgress,
  handleResult,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [createBroker, setCreateBroker] = React.useState<boolean>(false);
  const [checkBoxData, setCheckBoxData] = useState<CheckBoxData>({});

  const [ingressNodes, setIngressNodes] = useState<ingressNode[]>([]);
  const [selectedIngressNode, setSelectedIngressNode] = useState<ingressNode>();
  const [selectedEgress, setSelectedEgress] = useState<string>("");
  const [selectedDataFormat, setSelectedDataFormat] =
    useState<string>("string");

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

  const handleChangeMetadata = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    console.log(name, checked);
    console.log(JSON.stringify(checkBoxData));
    setCheckBoxData({ ...checkBoxData, [name]: checked });
  };

  const handleSubmit = (values: FormData) => {
    console.log("submit", values, ingressNodes);
    setPopupEgress(false);
    values.ingressId = selectedIngressNode?.id;
    values.createBroker = !createBroker;
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
              values.metadata!.frequency = values.frequency.toString();
              break;
          }
        }
      }
    }

    console.log("submitting:", JSON.stringify(values));

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
      .catch((error) => console.error(error.message));
  };

  function handleEgressClick(data: any): void {
    setSelectedEgress(data.name);
  }

  const handleSelectObservableProperty = (observableProperty: any) => {
    console.log("observable property", observableProperty);
    setSelectedIngressNode(observableProperty);
    // setIngressNodes([...ingressNodes, observableProperty]);
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
                      <InputLabel id="dataFormat-label">Data Format</InputLabel>
                      <Field
                        as={Select}
                        name="dataFormat"
                        labelId="dataFormat-label"
                        label="dataFormat"
                        size="small"
                      >
                        <MenuItem value="RAW">Raw</MenuItem>
                        <MenuItem value="WITH_METADATA">With Metadata</MenuItem>
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

                    {(values.protocol === "MQTT" ||
                      values.protocol === "OPCUA") && (
                      <>
                        <Field name="createBroker">
                          {({ field }: FieldProps<FormData>) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  {...field}
                                  defaultChecked={values.createBroker}
                                  onChange={() => {
                                    values.createBroker = !values.createBroker;
                                    console.log(values.createBroker);
                                    setCreateBroker(values.createBroker);
                                  }}
                                  disabled={values.protocol === "OPCUA"}
                                  color="primary"
                                />
                              }
                              label="Providing your own broker"
                            />
                          )}
                        </Field>
                      </>
                    )}

                    {createBroker && values.protocol === "MQTT" && (
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
                        Select the containing element in which you would like to
                        store your Egress Endpoint.
                      </p>
                    </Box>
                    <Grid2 container spacing={2} sx={{ height: "60vh" }}>
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
                          marginRight: "20px",
                          borderRadius: "10px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <DetailedView
                          containingEntityId={selectedEgress}
                          onOpenChart={(observableProperty: any) => {
                            handleSelectObservableProperty(observableProperty);
                            values.frequency = observableProperty.frequency;
                            values.changedFrequency =
                              observableProperty.frequency;
                          }}
                          withDetails={false}
                        />
                      </Grid2>
                      <Grid2
                        xs={2.5}
                        sx={{
                          marginTop: "30px",
                          marginRight: "20px",
                          borderRadius: "10px",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        <Typography variant="h6">
                          Selected Element: {selectedIngressNode?.name}
                        </Typography>
                        <Typography>
                          <Box component="span" fontWeight="bold">
                            Id:
                          </Box>{" "}
                          {selectedIngressNode?.id}
                        </Typography>
                        <Typography>
                          <Box component="span" fontWeight="bold">
                            Name:
                          </Box>{" "}
                          {selectedIngressNode?.name}
                        </Typography>
                        <Typography>
                          <Box component="span" fontWeight="bold">
                            Topic:
                          </Box>{" "}
                          {selectedIngressNode?.topic}
                        </Typography>
                        <Typography>
                          <Box component="span" fontWeight="bold">
                            Frequency:
                          </Box>{" "}
                          {selectedIngressNode?.frequency}
                        </Typography>
                      </Grid2>
                    </Grid2>
                  </>
                )}
                {activeStep === 2 && !selectedIngressNode && (
                  <>
                    <Box
                      sx={{
                        backgroundColor: "rgba(255, 0, 0, 0.9)",
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
                      <p>Please select an Observable Property first</p>
                    </Box>
                  </>
                )}
                {activeStep === 2 && selectedIngressNode && (
                  <>
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
                          Here you can choose to reduce the frequency of the
                          data and select how they should be reduced.
                        </p>
                      </Box>
                    </>
                    <Field name="frequency">
                      {({ field }: FieldProps<FormData>) => (
                        <TextField
                          {...field}
                          label="Original Frequency"
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
                          label="New Frequency"
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
                    {values.changedFrequency &&
                      values.changedFrequency != values.frequency && (
                        <FormControl
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        >
                          <InputLabel id="protocol-label">
                            Down Sampling Method
                          </InputLabel>
                          <Field
                            as={Select}
                            name="downSamplingMethod"
                            labelId="downSamplingMethod-label"
                            label="downSamplingMethod"
                            size="small"
                          >
                            <MenuItem value="AVERAGE">
                              Average Value - only for numbers
                            </MenuItem>
                            <MenuItem value="LATEST">Use latest value</MenuItem>
                            <MenuItem value="MEDIAN">Median</MenuItem>
                            <MenuItem value="ACCUMULATED">
                              Accumulate strings - comma separated
                            </MenuItem>
                          </Field>
                        </FormControl>
                      )}
                  </>
                )}
                {activeStep === 3 && (
                  <Typography variant="h6">Select Group</Typography>
                )}
                {activeStep === 4 && <Typography variant="h6">Info</Typography>}
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
                {!selectedIngressNode && (
                  <div>
                    <Chip
                      label={"An observable property is required"}
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
                  disabled={!(isValid && selectedIngressNode)}
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

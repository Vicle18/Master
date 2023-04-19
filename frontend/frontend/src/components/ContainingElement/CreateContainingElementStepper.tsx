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
import InfoIcon from "@mui/icons-material/Info";

import SensorsIcon from "@mui/icons-material/Sensors";
import { Formik, Form, Field, FieldProps, useFormikContext } from "formik";
import * as Yup from "yup";
import Grid2 from "@mui/material/Unstable_Grid2";

import { initialValues, validationSchema, FormData } from "./FormDefinition";
import DetailedView from "../Ingress/IngressDetailed";
import IngressOverviewLeft from "../Ingress/IngressOverviewLeft";

interface Props {
  setPopupContainingElement: React.Dispatch<React.SetStateAction<boolean>>;
  PopupContainingElement: boolean;
  handleResult: (result: string) => void;
}

const steps = [
  "Define Meta data",
  "Select Parent",
  "Select Children",
  "Select Observable Properties",
];

const CreateContainingElementStepper: React.FC<Props> = ({
  setPopupContainingElement,
  PopupContainingElement,
  handleResult,
}) => {
  const [result, setResult] = useState<string | null>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [ingressNodes, setIngressNodes] = useState<string[]>(
    initialValues.observableProperties as string[]
  );
  const [children, setChildren] = useState<string[]>(
    initialValues.children as string[]
  );
  const [selectedIngressNode, setSelectedIngressNode] = useState<string>("");
  const [selectedChild, setSelectedChild] = useState<any>("");

  const [selectedParent, setSelectedParent] = useState<any>("");
  const [selectedContainingElement, setSelectedContainingElement] =
    useState<string>("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handlerClose = () => {
    setPopupContainingElement(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (values: FormData) => {
    console.log("submit", values, ingressNodes);
    setPopupContainingElement(false);
    values.children = children;
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers":
        "Origin, Content-Type, X-Auth-Token, X-Requested-With",
    };

    fetch(`${process.env.REACT_APP_MIDDLEWARE_URL}/api/ContainingElement`, {
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

  function HandleContainingElementClick(data: any): void {
    setSelectedContainingElement(data);
    console.log("selected containing element", data);
  }
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleSelectObservableProperty = (observableProperty: any) => {
    console.log("observable property", observableProperty);
    setSelectedIngressNode(observableProperty.name);
    setIngressNodes([...ingressNodes, observableProperty.name]);
  };
  const handleDelete = (element: string) => {
    setIngressNodes(ingressNodes.filter((node) => node !== element));
  };

  const handleSelectChild = (child: any) => {
    console.log("observable property", child.id);
    setChildren([...children, child.id]);
  };
  const handleDeleteChild = (child: string) => {
    setChildren(children.filter((node) => node !== child));
  };



  function getParentOptionsFilter(type: string): string[] | undefined {
    switch (type) {
      case "company":
        return undefined;
      case "plant":
        return ["companies"];
      case "area":
        return ["companies", "plants"];
      case "line":
        return ["areas"];
      case "cell":
        return ["lines"];
      case "machine":
        return ["cells"];
      default:
        return undefined;
    }
  }


  function getChildrenOptionsFilter(type: string): string[] | undefined {
    switch (type) {
      case "company":
        return ["plants"];
      case "plant":
        return ["areas"];
      case "area":
        return ["lines"];
      case "line":
        return ["cells"];
      case "cell":
        return ["machines"];
      case "machine":
        return [];
      default:
        return undefined;
    }
  }

  return (
    <div>
      <Dialog
        open={PopupContainingElement}
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
                  To create an ContainingElement endpoint, please enter the following
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
                      <InputLabel id="type-label">Type</InputLabel>
                      <Field
                        as={Select}
                        name="type"
                        labelId="type-label"
                        label="Type"
                        size="small"
                      >
                        <MenuItem value="company">Company</MenuItem>
                        <MenuItem value="plant">Plant</MenuItem>
                        <MenuItem value="area">Area</MenuItem>
                        <MenuItem value="line">Line</MenuItem>
                        <MenuItem value="cell">Cell</MenuItem>
                        <MenuItem value="machine">Machine</MenuItem>

                      </Field>
                    </FormControl>
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
                        Here you can select where to store your containing element
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
                                  Current Element: {selectedParent.name}
                                </Typography>
                              </Box>
                            </Grid2>
                            <Grid2 container xs={3}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  values.parent = selectedParent.id;
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
                            HandleContainingElementClick(parent);
                            setSelectedParent(parent);
                            console.log("parent", values.parent);
                            console.log(values.type)
                          }}
                          filter={getParentOptionsFilter(values.type)}
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
                            Selected Element: {values.parent}
                          </Typography>
                        </Box>
                      </Grid2>
                    </Grid2>
                  </>
                )}

                {activeStep === 2 && ( //children
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
                        Select which subelements should be stored in your containing element
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
                                  Current Element: {selectedChild.name}
                                </Typography>
                              </Box>
                            </Grid2>
                            <Grid2 container xs={3}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  handleSelectChild(selectedChild.id);
                                }}
                              >
                                SELECT
                              </Button>
                            </Grid2>
                          </Grid2>
                        </Box>

                        <Divider />
                        <IngressOverviewLeft
                          onItemClick={(child: any) => {
                            HandleContainingElementClick(child);
                            setSelectedChild(child);

                          }}
                          filter={getChildrenOptionsFilter(values.type)}
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
                        <List
                          dense={true}
                          sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                          }}
                          subheader={
                            <ListSubheader>Children</ListSubheader>
                          }
                        >
                          {children.map((node) => (
                            <ListItemButton
                              key={node}
                              sx={{
                                "&:hover": { backgroundColor: "#f0f0f0" },
                              }}
                            >
                              <ListItemIcon>
                                <SensorsIcon />
                              </ListItemIcon>
                              <ListItemText primary={node} />
                              <IconButton
                                edge="end"
                                onClick={() => handleDeleteChild(node)}
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

                {activeStep === 3 && (
                  <>
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
                        <IngressOverviewLeft
                          onItemClick={(containingElement: any) => {
                            HandleContainingElementClick(containingElement.name);
                          }}
                        />
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
                          containingEntityId={selectedContainingElement}
                          onOpenChart={handleSelectObservableProperty}
                          withDetails={false}
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
                              key={node}
                              sx={{
                                "&:hover": { backgroundColor: "#f0f0f0" },
                              }}
                            >
                              <ListItemIcon>
                                <SensorsIcon />
                              </ListItemIcon>
                              <ListItemText primary={node} />
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
                  disabled={!(isValid) || activeStep != 3}
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
export default CreateContainingElementStepper;

import * as React from "react";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl, InputLabel, MenuItem,
  Select,
  Step,
  StepButton, Stepper,
  TextField
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Grid2 from "@mui/material/Unstable_Grid2";
import { initialValues, validationSchema } from "../createv2/FormDefinition";
import { Field, FieldProps, Form, Formik } from "formik";
import IngressOverviewLeft from "../IngressOverviewLeft";

export function editIngressEndpoint(PopupIngress: boolean, handleClose: () => void, handleFinish: (values: any) => void, activeStep: number, steps: string[], handleNext: () => void, handleBack: () => void, selectedContainingElement: string, handleIngressClick: (data: any) => void, setSelectedParent: React.Dispatch<React.SetStateAction<string>>): React.ReactNode {
  return <div>
    <Dialog
      open={PopupIngress}
      onClose={handleClose}
      scroll={"paper"}
      fullWidth={true}
      maxWidth={"lg"}
      sx={{
        // width: "80vw",
        //height: "80vh",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFinish}
      >
        {({
          values, errors, touched, handleSubmit, isValid,
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
                {steps.map((label) => {
                  return (
                    <Step key={label}>
                      <StepButton color="inherit" onClick={handleNext}>
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
                        helperText={touched.name && errors.name} />
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
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description} />
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
                              helperText={touched.host && errors.host} />
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
                              helperText={touched.port && errors.port} />
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
                            helperText={touched.topic && errors.topic} />
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
                            helperText={touched.nodeId && errors.nodeId} />
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
                        helperText={touched.frequency && errors.frequency} />
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
                        error={touched.changedFrequency &&
                          Boolean(errors.changedFrequency)}
                        helperText={touched.changedFrequency && errors.changedFrequency} />
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
                        error={touched.dataFormat && Boolean(errors.dataFormat)}
                        helperText={touched.dataFormat && errors.dataFormat} />
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
                    variant="outlined" />
                </div>
              )}
              {errors.description && (
                <div>
                  <Chip
                    label={errors.description}
                    color="error"
                    variant="outlined" />
                </div>
              )}

              <Button
                variant="outlined"
                color="primary"
                onClick={handleClose}
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
  </div>;
}

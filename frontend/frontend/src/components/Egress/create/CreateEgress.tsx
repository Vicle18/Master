import React, { useState } from "react";
import axios from "axios";
import {
  Button,
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
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SensorsIcon from "@mui/icons-material/Sensors";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import Grid2 from "@mui/material/Unstable_Grid2";
import DetailedView from "../../Ingress/IngressDetailed";
import IngressOverviewLeft from "../../Ingress/IngressOverviewLeft";
import { initialValues, validationSchema, FormData } from "./FormDefinition";

interface Props {
  setPopupEgress: React.Dispatch<React.SetStateAction<boolean>>;
  PopupEgress: boolean;
  handleResult: (result: string) => void;
}

const CreateEgress: React.FC<Props> = ({
  setPopupEgress,
  PopupEgress,
  handleResult,
}) => {
  const [result, setResult] = useState<string | null>(null);
  const [ingressNodes, setIngressNodes] = useState<string[]>(
    initialValues.ingressNodes as string[]
  );
  const [selectedIngressNode, setSelectedIngressNode] = useState<string>("");
  const [selectedContainingElement, setSelectedContainingElement] =
    useState<string>("");
  const [selectedDataFormat, setSelectedDataFormat] = useState<string>("string");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handlerClose = () => {
    setPopupEgress(false);
  };

  const handleSubmit = (values: FormData) => {
    console.log("submit", values, ingressNodes);
    setPopupEgress(false);

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers":
        "Origin, Content-Type, X-Auth-Token, X-Requested-With",
    };

    console.log("CREATE EGRESSS")

    axios
      .get("https://localhost:7033/api/Egress", { headers })
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

    fetch("https://localhost:7033/api/Egress?=", {
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

  function handleContainingElementClick(data: any): void {
    setSelectedContainingElement(data);
  }

  const handleSelectObservableProperty = (observableProperty: any) => {
    console.log("observable property", observableProperty);
    setSelectedIngressNode(observableProperty.name);
    setIngressNodes([...ingressNodes, observableProperty.name]);
  };
  const handleDelete = (element: string) => {
    setIngressNodes(ingressNodes.filter((node) => node !== element));
  };
  return (
    <div>
      <Dialog
        open={PopupEgress}
        onClose={handlerClose}
        maxWidth="lg"
        scroll={"paper"}
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
              <DialogTitle>Create Egress Endpoint</DialogTitle>
              <DialogContent
                dividers={true}
                sx={{ overflow: "auto", maxHeight: "calc(100vh - 250px)" }}
              >
                <DialogContentText>
                  To create an Egress endpoint, please enter the following
                  information.
                </DialogContentText>

                <Grid2 container spacing={2} sx={{ height: "100%" }}>
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
                    <Typography variant="h1" component="h2">
                      Setup Information
                    </Typography>
                    <Divider />
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
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="data-format-select-label">Data Format</InputLabel>
                      <Select
                        labelId="data-format-select-label"
                        id="data-format-select"
                        value={selectedDataFormat}
                        onChange={(event) => setSelectedDataFormat(event.target.value)}
                        label="Data Format"
                      >
                        <MenuItem value="string">String</MenuItem>
                        <MenuItem value="raw">Raw</MenuItem>
                      </Select>
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
                          sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}
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
                  <Grid2
                    xs={3.8}
                    sx={{
                      marginTop: "30px",
                      marginRight: "20px",
                      borderRadius: "10px",

                      backgroundColor: "whitesmoke",
                    }}
                  >
                    <Typography variant="h6" component="h2">
                      Select a containing element to show observable properties
                    </Typography>
                    <Divider />
                    <IngressOverviewLeft
                      onItemClick={handleContainingElementClick}
                    />
                  </Grid2>
                  <Grid2
                    xs
                    sx={{
                      marginTop: "30px",
                      marginRight: "50px",
                      borderRadius: "10px",
                      backgroundColor: "whitesmoke",
                    }}
                  >
                    <Typography variant="h6" component="h2">
                      Select an observable property
                    </Typography>
                    <Divider />
                    <DetailedView
                      containingEntityId={selectedContainingElement}
                      onOpenChart={handleSelectObservableProperty}
                      withDetails={false}
                    />
                  </Grid2>
                </Grid2>
              </DialogContent>
              <DialogActions>
                {errors.name && <div>{errors.name}</div>}
                <Button onClick={handlerClose}>Cancel</Button>
                <Button type="submit" disabled={!isValid}>
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
export default CreateEgress;

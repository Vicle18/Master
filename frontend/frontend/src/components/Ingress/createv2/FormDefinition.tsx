import * as Yup from "yup";
export interface FormData {
  name: string;
  description: string;
  protocol: string;
  frequency: string;
  changedFrequency?: string;
  host?: string;
  port?: string;
  topic?: string;
  nodeId?: string;
  containingElement: string;
  dataFormat: string;
}

export const initialValues: FormData = {
  name: "defaultName",
  description: "default Description",
  protocol: "MQTT",
  frequency: "30",
  changedFrequency: "30",
  host: "172.17.0.1", //172.17.0.1 is the default host for the mosquitto container on the docker network
  topic: "example",
  port: "1883",
  nodeId: "",
  containingElement: "Machine A",
  dataFormat: "JSON",
};
  
export const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required("Description is required"),
  protocol: Yup.string().required("Protocol is required"),
  frequency: Yup.string().required("Frequency is required"),
  changedFrequency: Yup.string().optional(),
  host: Yup.string().when("protocol", {
    is: (protococol: string) => protococol === "MQTT",
    then: (schema) => schema.required("host is required"),
    otherwise: (schema) => schema,
  }),
  port: Yup.string().when("protocol", {
    is: (protococol: string) => protococol === "MQTT",
    then: (schema) => schema.required("port is required"),
    otherwise: (schema) => schema,
  }),
  topic: Yup.string().when("protocol", {
    is: (protococol: string) => protococol === "MQTT",
    then: (schema) => schema.required("topic is required"),
    otherwise: (schema) => schema,
  }),
  nodeId: Yup.string().when("protocol", {
    is: "OPCUA",
    then: (schema) => schema.required("nodeid is required"),
    otherwise: (schema) => schema,
  }),
  containingElement: Yup.string().required("Containing element is required"),
  dataFormat: Yup.string().required("Data format is required"),
});
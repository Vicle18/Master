import * as Yup from "yup";
export interface FormData {
  id: string;
  name: string;
  description: string;
  protocol: string;
  frequency: string;
  changedFrequency?: string;
  host?: string;
  port?: string;
  topic?: string;
  output?: string
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
  host: "172.17.0.1",
  topic: "example",
  port: "1883",
  output: "timestamp",
  nodeId: "",
  containingElement: "Machine A",
  dataFormat: "JSON",
  id: ""
};

export const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  id: Yup.string().required(),
  name: Yup.string().required(),
  description: Yup.string().required("Description is required"),
  protocol: Yup.string().required("Protocol is required"),
  frequency: Yup.string().required("Frequency is required"),
  changedFrequency: Yup.string().test('lower-frequency', 'Changed frequency cannot be higher than frequency', function (changedFrequency) {
    const { frequency } = this.parent;
    if (!changedFrequency || !frequency) { return true; }
    return parseInt(changedFrequency) <= parseInt(frequency); // check if changedFrequency is lower than or equal to frequency
  }),
  host: Yup.string().when("protocol", {
    is: (protocol: string) => protocol === "MQTT" || protocol === "RTDE",
    then: (schema) => schema.required("host is required"),
    otherwise: (schema) => schema,
  }),
  port: Yup.string().when("protocol", {
    is: (protocol: string) => protocol === "MQTT" || protocol === "RTDE",
    then: (schema) => schema.required("port is required"),
    otherwise: (schema) => schema,
  }),
  output: Yup.string().when("protocol", {
    is: (protococol: string) => protococol === "RTDE",
    then: (schema) => schema.required("output is required"),
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
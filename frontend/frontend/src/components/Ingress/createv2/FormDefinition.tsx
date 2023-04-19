import * as Yup from "yup";
import { v4 as uuidv4 } from 'uuid';
interface Metadata {
  timestamp?: boolean;
  name?: string;
  description?: string;
  frequency?: string;
}
export interface FormData {
  id: string;
  name: string;
  description: string;
  protocol: string;
  dataType:string;
  frequency: string;
  changedFrequency?: string;
  host?: string;
  port?: string;
  topic?: string;
  output?: string
  nodeId?: string;
  containingElement: string;
  dataFormat: string;
  downsampleMethod:string;
  metadata?: Metadata;
}

export const initialValues: FormData = {
  // id with random uuid generated based on uuidv4
  id: uuidv4(),
  name: "Robot Mode" + Math.floor(Math.random() * 1000),
  description: "default Description",
  protocol: "RTDE",
  frequency: "1",
  changedFrequency: "1",
  host: "172.17.0.1",
  topic: "example",
  port: "1883",
  output: "robot_mode",
  nodeId: "",
  containingElement: "Robot 1",
  dataFormat: "RAW",
  dataType: "STRING",
  downsampleMethod: "AVERAGE"
};

export const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  id: Yup.string().required(),
  name: Yup.string().required(),
  description: Yup.string().required("Description is required"),
  protocol: Yup.string().required("Protocol is required"),
  dataType: Yup.string().required("Data type is required"),
  frequency: Yup.string().required("Frequency is required"),
  changedFrequency: Yup.string().test('lower-frequency', 'Changed frequency cannot be higher than frequency', function (changedFrequency) {
    const { frequency } = this.parent;
    if (!changedFrequency || !frequency) { return true; }
    return parseInt(changedFrequency) <= parseInt(frequency); // check if changedFrequency is lower than or equal to frequency
  }),
  downsampleMethod: Yup.string().required("Downsample method is required"),
  // downsampleMethod: Yup.string().when(datatype, {
  //   is:(datatype:string) => datatype === "AVERAGE" || datatype === ""
  // })
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
  metadata: Yup.object().optional()
});
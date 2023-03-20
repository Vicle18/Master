import * as Yup from "yup";
export interface FormData {
  name: string;
  description: string;
  protocol: string;
  host?: string;
  port?: string;
  topic?: string;
  nodeId?: string;
  containingElement: string;

}

export const initialValues: FormData = {
  name: "defaultName",
  description: "default Description",
  protocol: "MQTT",
  host: "23.23.23.23",
  topic: "test",
  port: "1883",
  nodeId: "",
  containingElement: "test",
};
  
export const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  protocol: Yup.string().required("Protocol is required"),
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
});
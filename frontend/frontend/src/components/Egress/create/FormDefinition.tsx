import * as Yup from "yup";

export interface ingressNode{
    id: string;
    name: string;
    topic: string;
    frequency: number;

}
export interface FormData {
    name: string;
    description: string;
    protocol: string;
    host?: string;
    port?: string;
    nodeId?: string;
    ingressNodes?: (ingressNode | undefined)[];
  }
  
export const initialValues: FormData = {
    name: "defaultName",
    description: "default Description",
    protocol: "MQTT",
    host: "23.23.23.23",
    port: "1883",
    nodeId: "",
    ingressNodes: [{
        id: "firstNode",
        name: "firstNode",
        topic: "firstTopic",
        frequency: 30,
    }],
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
    nodeId: Yup.string().when("protocol", {
      is: "OPCUA",
      then: (schema) => schema.required("nodeid is required"),
      otherwise: (schema) => schema,
    }),
    ingressNodes: Yup.array()
      .of(Yup.mixed<ingressNode>())
      .min(1)
      .optional(),
  });
import * as Yup from "yup";

export interface ingressNode {
  id: string;
  name: string;
  topic?: {
    name: string;
  }
  frequency: number;
  changedFrequency: number;
  dataFormat: string;
  metadata?: {
    timestamp?: boolean;
    name?: string;
    description?: string;
    frequency?: string;
  };
}
export interface FormData {
  name: string;
  description: string;
  protocol: string;
  createBroker: boolean | undefined;
  frequency: number;
  changedFrequency?: (number | undefined);
  downSamplingMethod?: (string | undefined);
  host?: string;
  port?: string;
  serverUrl?:string;
  nodeId?: string;
  nodeType?: string;
  ingressId?: (string | undefined);
  dataFormat: string;
  groupId?: string;
  metadata?: {
    timestamp?: boolean;
    name?: string;
    description?: string;
    frequency?: string;
  };
}

export const egressInitialValues: FormData = {
  name: "",
  description: "",
  protocol: "",
  host: "localhost", //172.17.0.1 is the default host for the mosquitto container on the docker network
  port: "8088",
  createBroker: false,
  frequency: 0,
  changedFrequency: 0,
  downSamplingMethod: "",
  ingressId: "",
  dataFormat: "",
  groupId: "",
};

export const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  protocol: Yup.string().required("Protocol is required"),
  createBroker: Yup.boolean().when("protocol", {
    is: (protococol: string) => protococol === "MQTT" || protococol === "OPCUA",
    then: (schema) => schema.required("Create Broker is required"),
    otherwise: (schema) => schema,
  }),
  host: Yup.string().when("protocol", {
    is: (protococol: string) => protococol === "MQTT",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema,
  }),
  port: Yup.string().when("protocol", {
    is: (protococol: string) => protococol === "MQTT",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema,
  }),
  nodeId: Yup.string().when("protocol", {
    is: "OPCUA",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema,
  }),
  frequency: Yup.number().required("Frequency is required"),
  changedFrequency: Yup.number().optional(),
  downSamplingMethod: Yup.string().optional(),
  ingressId: Yup.string().optional(),
  dataFormat: Yup.string().required("dataFormat is required"),
  groupId: Yup.string().optional(),
  metadata: Yup.object().optional(),
  serverUrl: Yup.string().when("protocol", {
    is: "OPCUA",
    then: (schema) => schema.required("Server URL is required"),
    otherwise: (schema) => schema,
  }),
  nodeType: Yup.string().when("protocol", {
    is: "OPCUA",
    then: (schema) => schema.required("Node Type is required"),
    otherwise: (schema) => schema,
  }),

});
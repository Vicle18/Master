import * as Yup from "yup";

export interface ingressNode {
  id: string;
  name: string;
  topic: string;
  frequency: number;
  changedFrequency: number;

}
export interface FormData {
  name: string;
  description: string;
  protocol: string;
  createBroker: boolean | undefined;
  frequency: string;
  frequencies?:  (number | undefined)[];
  changedFrequencies?: (number | undefined)[];
  host?: string;
  port?: string;
  ingressIds?: (string | undefined)[];
  dataFormat?: string;
}

export const initialValues: FormData = {
  name: "defaultName",
  description: "default Description",
  protocol: "MQTT",
  host: "172.17.0.1", //172.17.0.1 is the default host for the mosquitto container on the docker network
  port: "1883",
  createBroker: false,
  frequency: "30",
  frequencies: [30],
  changedFrequencies: [30],
  ingressIds: ["jointTemperature2"],
  dataFormat: "string",
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
  frequency: Yup.string().required("Frequency is required"),
  frequencies: Yup.array().of(Yup.mixed<number>())
  .min(1)
  .optional(),
  changedFrequencies: Yup.array().of(Yup.mixed<number>())
  .min(1)
  .optional(),
  ingressIds: Yup.array()
    .of(Yup.mixed<string>())
    .min(1)
    .optional(),

  dataFormat: Yup.string().required("dataFormat is required"),
});
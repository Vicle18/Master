import * as Yup from "yup";
export interface FormData {
    name: string;
    description: string;
    egressEndpointIds?: (string | undefined)[];
  }
  
export const initialValues: FormData = {
    name: "",
    description: "",
    egressEndpointIds: [],
  };
  
 export const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    egressEndpointIds: Yup.array().of(Yup.string()).optional()
  });
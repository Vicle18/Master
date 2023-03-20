import * as Yup from "yup";
export interface FormData {
    name: string;
    description: string;
    parent?: string;
    children?: (string | undefined)[];
    ingressNodes?: (string | undefined)[];
  }
  
export const initialValues: FormData = {
    name: "defaultName",
    description: "default Description",
    parent: "",
    children: [],
    ingressNodes: [],
  };
  
 export const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    parent: Yup.string().optional(),
    children: Yup.array().of(Yup.string()).optional(),
    ingressNodes: Yup.array().of(Yup.string()).optional()
  });
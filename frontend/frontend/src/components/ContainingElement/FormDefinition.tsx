import * as Yup from "yup";
export interface FormData {
    name: string;
    description: string;
    type: string;
    parent?: string;
    children?: (string | undefined)[];
    observableProperties?: (string | undefined)[];
  }
  
export const initialValues: FormData = {
    name: "defaultName",
    description: "default Description",
    type: "area",
    parent: "",
    children: [],
    observableProperties: [],
  };
  
 export const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    type: Yup.string().required("Type is required"),
    parent: Yup.string().optional(),
    children: Yup.array().of(Yup.string()).optional(),
    observableProperties: Yup.array().of(Yup.string()).optional()
  });
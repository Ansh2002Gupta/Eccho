import * as Yup from "yup";

export const AddNewContactSchema = Yup.object().shape({
  contactName: Yup.string()
    .min(5, "Too short!")
    .max(50, "Too Long!")
    .required("Name is required!"),
  contactEmail: Yup.string().email("Invalid email"),
  contactPhoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required!"),
});

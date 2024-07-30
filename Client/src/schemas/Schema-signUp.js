import * as Yup from "yup";

export const SignUpSchema = Yup.object().shape({
  userName: Yup.string()
    .min(5, "Too short!")
    .max(50, "Too Long!")
    .required("User name is required!"),
  email: Yup.string().email("Invalid email").required("Email is required!"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required!"),
  passCode: Yup.string()
    .min(8, "Too short!")
    .max(50, "Too Long!")
    .required("Password is required!"),
});

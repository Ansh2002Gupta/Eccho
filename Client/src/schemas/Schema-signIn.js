import * as Yup from "yup";

export const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required!"),
  passCode: Yup.string()
    .min(8, "Too short!")
    .max(50, "Too Long!")
    .required("Password is required!"),
});

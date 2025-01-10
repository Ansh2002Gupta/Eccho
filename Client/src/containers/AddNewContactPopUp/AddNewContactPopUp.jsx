import { useEffect, useRef, useState } from "react";
import { Field, Form, Formik, useFormikContext } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { AddNewContactSchema } from "../../schemas/Schema-add-new-contact";
import EcchoTextField from "../../components/EcchoTextField";
import ContactPopUp from '../ContactPopUp/ContactPopUp';
import Call from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircle from "@mui/icons-material/AccountCircle";
import styles from './AddNewContactPopUp.module.scss';
import { mergeRefs } from "../../utility/mergeRefs";
import { useDispatch, useSelector } from "react-redux";
import { appConstants } from "../../config/app_constants";
import { setLoading } from "../../redux/reducers/apiReducer";
import axios from "axios";
import { showNotification } from "../../redux/reducers/notificationReducer";
import Loader from "../../../public/images/Loader.svg";

const AddNewContactPopUp = ({ targetRef, setPopUpElement, setIsAddNewTriggered }) => {
    const initialFormValues = { contactName: "", contactEmail: "", contactPhoneNumber: "" };
    const [isFormDirty, setIsFormDirty] = useState(false);
    const isfetchListAgain = useRef(false);
    const adminId = useSelector((state) => state.adminContext.adminId);
    const dispatch = useDispatch();

    const handleFormSubmission = (values) => {
        dispatch(setLoading({ isLoading: true }));
        axios({
            method: "post",
            baseURL: appConstants.API_BASE_URL,
            url: "/operations/add-new-contact",
            data: {
                adminId: adminId,
                name: values.contactName,
                email: values.contactEmail,
                phoneNumber: values.contactPhoneNumber,
            },
            withCredentials: true,
        })
            .then((response) => {
                if (response.status === 201) {
                    isfetchListAgain.current = true;
                    dispatch(
                        showNotification({
                            isVisible: true,
                            type: "success",
                            message: response?.message ?? "Contact Saved!",
                            adornmentImage: Loader,
                        })
                    );
                    handleCancel();
                } else {
                    dispatch(
                        showNotification({
                            isVisible: true,
                            type: "error",
                            message:
                                response?.error ?? response?.message ?? "Some error occurred!",
                            adornmentImage: Loader,
                        })
                    );
                }
            })
            .catch((error) => {
                dispatch(
                    showNotification({
                        isVisible: true,
                        type: "error",
                        message: error?.response?.data?.message ?? "Some error occurred!",
                        adornmentImage: Loader,
                    })
                );
            })
            .finally(() => dispatch(setLoading({ isLoading: false })));
    };

    const handleCancel = () => {
        setPopUpElement([<ContactPopUp {...{ setPopUpElement }} triggerRerender={isfetchListAgain.current} />]);
        setIsAddNewTriggered(false);
    }

    return <>
        <motion.div ref={targetRef} initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 10 }} transition={{ type: 'spring', stiffness: 300, duration: 1.5, delay: 0.2 }} className={`${styles.outerContainer}`}>
            <Formik
                initialValues={initialFormValues}
                validationSchema={AddNewContactSchema}
                onSubmit={handleFormSubmission}
            >
                {({ handleBlur, handleChange }) => {
                    return (
                        <Form>
                            <FormObserver
                                setIsFormDirty={setIsFormDirty}
                                totalFieldsOfForm={2}
                            />
                            <Field name="contactName">
                                {({ field, meta }) => {
                                    return (
                                        <EcchoTextField
                                            id="outlined-error-helper-text"
                                            label="Name"
                                            value={field.value}
                                            onChange={handleChange(field.name)}
                                            onBlur={handleBlur(field.name)}
                                            customStyles={{ m: 1, width: "100%", color: 'black' }}
                                            isStartAdornment
                                            adornmentElement={[<AccountCircle />]}
                                            isRequired
                                            isError={meta.touched && meta.error}
                                            helperText={meta.touched && meta.error ? meta.error : ""}
                                        />
                                    );
                                }}
                            </Field>
                            <Field name="contactEmail">
                                {({ field, meta }) => {
                                    return (
                                        <EcchoTextField
                                            type="email"
                                            label="Email"
                                            value={field.value}
                                            onChange={handleChange(field.name)}
                                            onBlur={handleBlur(field.name)}
                                            customStyles={{ m: 1, width: "100%", color: 'black' }}
                                            isStartAdornment
                                            adornmentElement={[<EmailIcon />]}
                                            isError={meta.touched && meta.error}
                                            helperText={meta.touched && meta.error ? meta.error : ""}
                                        />
                                    );
                                }}
                            </Field>
                            <Field name="contactPhoneNumber">
                                {({ field, meta }) => {
                                    return (
                                        <EcchoTextField
                                            label="Phone Number"
                                            value={field.value}
                                            onChange={handleChange(field.name)}
                                            onBlur={handleBlur(field.name)}
                                            customStyles={{ m: 1, width: "100%", color: 'black' }}
                                            isStartAdornment
                                            adornmentElement={[<Call />]}
                                            isRequired
                                            isError={meta.touched && meta.error}
                                            helperText={meta.touched && meta.error ? meta.error : ""}
                                        />
                                    );
                                }}
                            </Field>
                            <div className={`${styles.inRow} ${styles.marginLeft6}`}>
                                <AnimatePresence>
                                    <motion.button
                                        type="submit"
                                        className={`${styles.submitButton}`}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.3,
                                            ease: [0, 0.71, 0.2, 1.01],
                                        }}
                                    >
                                        Save
                                    </motion.button>
                                </AnimatePresence>
                                <AnimatePresence>
                                    <motion.button
                                        onClick={handleCancel}
                                        className={`${styles.cancelButton}`}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.3,
                                            ease: [0, 0.71, 0.2, 1.01],
                                        }}
                                    >
                                        Cancel
                                    </motion.button>
                                </AnimatePresence>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </motion.div>
    </>
}

const FormObserver = ({ setIsFormDirty, totalFieldsOfForm }) => {
    const { errors, touched } = useFormikContext();
    useEffect(() => {
        if (
            Object.keys(errors).length === 0 &&
            Object.keys(touched).length === totalFieldsOfForm
        ) {
            setIsFormDirty(false);
        } else setIsFormDirty(true);
    }, [errors, touched]);
    return null;
};

export default AddNewContactPopUp;

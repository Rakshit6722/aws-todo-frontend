import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { signupApi } from "./api/UserApiService";
import { useNavigate } from "react-router-dom";
import { SignUpFormValues } from "../types";

export default function SignUp() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const initialValues = {
    username: "",
    password: "",
    admin: false
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be between 3 and 20 characters long!")
      .max(20, "Username must be between 3 and 20 characters long!")
      .matches(
        /^[a-zA-Z0-9_.]+$/,
        "Username can only contain letters, numbers, underscores, or dots!"
      )
      .matches(
        /^(?!.*[_.]{2}).*$/,
        "Username must not contain consecutive dots or underscores!"
      )
      .matches(
        /^[^_.].*[^_.]$/,
        "Username must not start or end with a dot or underscore!"
      )
      .required("Username is required!"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long!")
      .max(32, "Password must not exceed 32 characters!")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter!")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter!")
      .matches(/[0-9]/, "Password must contain at least one number!")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character!"
      )
      .matches(/^\S*$/, "Password must not contain spaces!")
      .required("Password is required!"),
  });

  const onSubmit = (values: SignUpFormValues , { setSubmitting, resetForm }:any) => {
    const userPayload = {
      username: values.username,
      password: values.password,
      admin: "false",
    };

    signupApi(userPayload)
      .then((response) => {
        setMessage("User created successfully.");
        resetForm();
        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 409) {
            setMessage("A user with that username already exists.");
          } else if (error.response.status === 400) {
            console.log(error);
            if (error.response.data.username)
              setMessage(
                "Failed to create user: " + error.response.data.username
              );
            if (error.response.data.password)
              setMessage(
                "Failed to create user: " + error.response.data.password
              );
          } else {
            console.log(error.response.data);
            setMessage("Failed to create user.");
          }
        } else {
          // Network error or no response from server
          console.log(error);
          setMessage("Failed to create user. Please check your network connection or try again later.");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <fieldset className="form-group" style={{ textAlign: "center" }}>
                <label htmlFor="username">Username</label>
                <Field
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  style={{ width: "300px", margin: "0 auto" }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="alert alert-warning"
                />
              </fieldset>

              <fieldset className="form-group" style={{ textAlign: "center" }}>
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  style={{ width: "300px", margin: "0 auto" }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-warning"
                />
              </fieldset>

              <div style={{ textAlign: "center" }}>
                <button
                  className="btn btn-primary mt-3"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
              </div>
              <br/>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

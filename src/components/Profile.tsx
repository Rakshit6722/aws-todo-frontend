import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByUsernameApi, updateUserApi } from "./api/UserApiService";
import { ErrorMessage, Field, Form as FormikForm, Formik, FormikHelpers } from "formik";
import { useAuth } from "./security/AuthContext";
import { ProfileFormValues } from "../types";
import React from "react";

function Profile() {
  const authContext = useAuth();
  const username = authContext.username;
  const isAdmin = authContext.isAdmin;
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (username) {
      retrieveUser();
    }
  }, [username]);

  function retrieveUser() {
    if (!username) return;
    getUserByUsernameApi(username)
      .then((response) => {
      })
      .catch((error) => console.log(error));
  }

  function onSubmit(
    values: ProfileFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ProfileFormValues>
  ) {
    if (values.password === values.password2 && username) {
      const updatedUser = {
        id: 0, // or fetch the actual id if available
        username,
        password: values.password,
        admin: isAdmin,
      };
      updateUserApi(username, updatedUser)
        .then((response) => {
          setMessage("Password updated successfully.");
          resetForm();
          setTimeout(() => {
            setMessage("");
            navigate("/profile");
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
          setMessage("Failed to update password.");
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  }

  function validate(values: ProfileFormValues) {
    let errors: Partial<ProfileFormValues> = {};

    if (!values.password || !values.password2) {
      errors.password = "Password is required!";
    } else {
      if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters long!";
      }

      if (values.password.length > 64) {
        errors.password = "Password must not exceed 64 characters!";
      }

      if (!/[A-Z]/.test(values.password)) {
        errors.password = "Password must contain at least one uppercase letter!";
      }

      if (!/[a-z]/.test(values.password)) {
        errors.password = "Password must contain at least one lowercase letter!";
      }

      if (!/[0-9]/.test(values.password)) {
        errors.password = "Password must contain at least one number!";
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) {
        errors.password = "Password must contain at least one special character!";
      }

      const commonPasswords = ["password", "123456", "qwerty", "abc123"];
      if (commonPasswords.includes(values.password)) {
        errors.password = "Password is too common!";
      }

      if (values.password !== values.password2) {
        errors.password = "Passwords should match!";
      }
    }

    return errors;
  }

  return (
    <div className="container">
      <h1>Profile</h1>
      <h4>
        Since users have only 3 parameters -only 1 changeable-, profile page
        seems unnecessary now lol
      </h4>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Formik
          initialValues={{ password: "", password2: "" }}
          enableReinitialize={true}
          onSubmit={onSubmit}
          validate={validate}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(props) => (
            <FormikForm>
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-warning"
              />
              {message && (
                <div className="alert alert-info">{message}</div>
              )}
              <fieldset
                className="form-group"
                style={{ textAlign: "center" }}
              >
                <label>Password</label>
                <Field
                  type="password"
                  className="form-control"
                  name="password"
                  style={{ width: "300px", margin: "0 auto" }}
                />
              </fieldset>
              <fieldset
                className="form-group"
                style={{ textAlign: "center" }}
              >
                <label>Confirm Password</label>
                <Field
                  type="password"
                  className="form-control"
                  name="password2"
                  style={{ width: "300px", margin: "0 auto" }}
                />
              </fieldset>
              <div style={{ textAlign: "center" }}>
                <button
                  className="btn btn-success mt-3"
                  type="submit"
                  disabled={props.isSubmitting}
                >
                  Save
                </button>
              </div>
              <br />
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Profile;
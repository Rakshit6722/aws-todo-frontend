import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserByUsernameApi,
  updateUserApi,
  createUserApi,
} from "./api/UserApiService";
import { ErrorMessage, Field, Form as FormikForm, Formik, FormikHelpers } from "formik";
import { UserValues } from "../types";
import React from "react";

function User() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [initialValues, setInitialValues] = useState<UserValues>({
    username: "",
    password: "",
    admin: "false",
  });

  useEffect(() => {
    if (username !== "-1") {
      retrieveUser();
    }
  }, [username, retrieveUser]);

  function retrieveUser() {
    getUserByUsernameApi(username!)
      .then((response) => {
        const user = response.data;
        setInitialValues({
          username: user.username,
          password: "",
          admin: user.isAdmin ? "true" : "false",
        });
      })
      .catch((error) => {
        console.log(error);
        setMessage("User not found.");
      });
  }

  function onSubmit(values: UserValues, { setSubmitting, resetForm }: FormikHelpers<UserValues>) {
    console.log("Form submitted with values:", values);
    // For create, use id: 0 (or backend will assign), for update, try to get id from initialValues or set 0 as fallback
    const userPayload = {
      id: 0,
      username: values.username,
      password: values.password,
      admin: values.admin === "true",
    };

    if (username === "-1") {
      createUserApi(userPayload)
        .then((response) => {
          console.log("User created successfully:", response);
          setMessage("User created successfully.");
          resetForm();
          setTimeout(() => {
            setMessage("");
            navigate("/administrator/users");
          }, 2000);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          if (error.response && error.response.status === 409) {
            setMessage("A user with that username already exists.");
          } else if (error.response && error.response.status === 400) {
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
            console.log(error.response?.data);
            setMessage("Failed to create user.");
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else if (username) {
      // Try to get id from initialValues if available, else fallback to 0
      const updatePayload = {
        ...userPayload,
        id: initialValues && initialValues.id ? initialValues.id : 0,
      };
      updateUserApi(username, updatePayload)
        .then((response) => {
          console.log("User updated successfully:", response);
          setMessage("User updated successfully.");
          resetForm();
          setTimeout(() => {
            setMessage("");
            navigate("/administrator/users");
          }, 2000);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          if (error.response && error.response.status === 409) {
            setMessage("A user with that username already exists.");
          } else if (error.response && error.response.status === 400) {
            if (error.response.data.username)
              setMessage(
                "Failed to update user: " + error.response.data.username
              );
            if (error.response.data.password)
              setMessage(
                "Failed to update user: " + error.response.data.password
              );
          } else {
            console.log(error);
            setMessage("Failed to update user.");
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  }

  function validate(values: UserValues) {
    let errors: Partial<UserValues> = {};

    if (!values.username) {
      errors.username = "Username is required!";
    } else {
      if (values.username.length < 3 || values.username.length > 20) {
        errors.username = "Username must be between 3 and 20 characters long!";
      }
      if (!/^[a-zA-Z0-9_.]+$/.test(values.username)) {
        errors.username =
          "Username can only contain letters, numbers, underscores, or dots!";
      }
      if (/([_.])\1/.test(values.username)) {
        errors.username =
          "Username must not contain consecutive dots or underscores!";
      }
      if (/^[_.]/.test(values.username) || /[_.]$/.test(values.username)) {
        errors.username =
          "Username must not start or end with a dot or underscore!";
      }
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else {
      if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters long!";
      }
      if (values.password.length > 32) {
        errors.password = "Password must not exceed 32 characters!";
      }
      if (!/[A-Z]/.test(values.password)) {
        errors.password =
          "Password must contain at least one uppercase letter!";
      }
      if (!/[a-z]/.test(values.password)) {
        errors.password =
          "Password must contain at least one lowercase letter!";
      }
      if (!/[0-9]/.test(values.password)) {
        errors.password = "Password must contain at least one number!";
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) {
        errors.password =
          "Password must contain at least one special character!";
      }
      if (/\s/.test(values.password)) {
        errors.password = "Password must not contain spaces!";
      }
    }

    return errors;
  }

  return (
    <div className="container">
      <h1>{username === "-1" ? "Create User" : "Edit User"}</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={onSubmit}
          validate={validate}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(props) => (
            <FormikForm>
              <fieldset className="form-group" style={{ textAlign: "center" }}>
                <label>Username</label>
                <Field
                  type="text"
                  className="form-control"
                  name="username"
                  disabled={username !== "-1"}
                  style={{ width: "300px", margin: "0 auto" }}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="alert alert-warning"
                />
              </fieldset>

              <fieldset className="form-group" style={{ textAlign: "center" }}>
                <label>Password</label>
                <Field
                  type="password"
                  className="form-control"
                  name="password"
                  style={{ width: "300px", margin: "0 auto" }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-warning"
                />
              </fieldset>

              <fieldset className="form-group" style={{ textAlign: "center" }}>
                <label>Admin? </label>
                <div>
                  <Field type="radio" name="admin" value="true" />
                  <label htmlFor="admin">Yes</label>
                </div>
                <div>
                  <Field type="radio" name="admin" value="false" />
                  <label htmlFor="admin">No</label>
                </div>
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

export default User;
import { useNavigate, useParams } from "react-router-dom";
import { getTodoApi, updateTodoApi, createTodoApi } from "./api/TodoApiService";
import { useAuth } from "./security/AuthContext";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form as FormikForm, Formik, FormikHelpers } from "formik";
import moment from "moment";
import { TodoFormValues } from "../types";
import React from "react";

export default function Todo() {
  const authContext = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();
  const username = authContext.username;

  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (id !== "-1" && username) {
      retrieveTodos();
    }
  }, [id, username]);

  function retrieveTodos() {
  if (!username || !id) return;
  const todoId = Number(id);
  if (isNaN(todoId)) return;
  getTodoApi(username, todoId)
      .then((response) => {
        setDescription(response.data.description);
        setTargetDate(response.data.targetDate);
        setErrorMessage("");
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/not-authorized");
        } else if (error.response && error.response.status === 404) {
          navigate("/not-found");
        } else if (error.response && error.response.status === 400) {
          navigate("/bad-request");
        } else if (error.response && error.response.status === 500) {
          navigate("/server-error");
        } else {
          setErrorMessage("An error occurred while updating the todo.");
        }
        console.error(error);
      });
  }

  function onSubmit(values: TodoFormValues, { setSubmitting, resetForm }: FormikHelpers<TodoFormValues>) {
    setDescription(values.description);
    setTargetDate(values.targetDate);

    if (!username) return;
    const todoId = id && !isNaN(Number(id)) ? Number(id) : undefined;
    const todo = {
      id: todoId ?? 0,
      username,
      description: values.description,
      done: false,
      targetDate: values.targetDate,
    };

    if (id === "-1") {
      createTodoApi(username, todo)
        .then((response) => {
          navigate("/todos");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else if (todoId !== undefined) {
      updateTodoApi(username, todoId, todo)
        .then((response) => {
          navigate("/todos");
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            navigate("/not-authorized");
          } else if (error.response && error.response.status === 404) {
            navigate("/not-found");
          } else if (error.response && error.response.status === 400) {
            navigate("/bad-request");
          } else if (error.response && error.response.status === 500) {
            navigate("/server-error");
          } else {
            setErrorMessage("An error occurred while updating the todo.");
          }
          console.error(error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  }

  function validate(values: TodoFormValues) {
    let errors: Partial<TodoFormValues> = {};

    if (values.description.length < 5 || values.description == null) {
      errors.description = "Description must be at least 5 characters long";
    }

    if (!values.targetDate || !moment(values.targetDate).isValid()) {
      errors.targetDate = "Target date must be specified";
    }

    return errors;
  }

  return (
    <div className="container">
      <h1>Enter Todo Details</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div>
        <Formik
          initialValues={{ description, targetDate }}
          enableReinitialize={true}
          onSubmit={onSubmit}
          validate={validate}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(props) => (
            <FormikForm>
              <ErrorMessage
                name="description"
                component="div"
                className="alert alert-warning"
              />
              <ErrorMessage
                name="targetDate"
                component="div"
                className="alert alert-warning"
              />
              <fieldset className="form-group">
                <label>Description</label>
                <Field
                  type="text"
                  className="form-control"
                  name="description"
                />
                <label>Target Date</label>
                <Field
                  type="date"
                  className="form-control"
                  name="targetDate"
                />
              </fieldset>
              <div>
                <button className="btn btn-success m-5" type="submit" disabled={props.isSubmitting}>
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

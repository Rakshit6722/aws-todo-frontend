import { useState, useEffect } from "react";
import { getAllTodosByUsernameApi, deleteTodoApi } from "./api/TodoApiService";
import { useAuth } from "./security/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import { Todo } from "../types";
import React from "react";

export default function TodoList() {

  useEffect(() =>{
    refreshTodos();
  }, [])
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const authContext = useAuth();
  const username = authContext.username;
  const navigate = useNavigate();

  function refreshTodos() {
    if (!username) return;

    getAllTodosByUsernameApi(username)
      .then((response) => {
        console.log("API Response:", response);
        if (Array.isArray(response.data)) {
          setTodos(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function deleteTodo(id:number){
    if (!username) return;

    deleteTodoApi(username,id)
        .then(() => {
          refreshTodos();
        })
        .catch((err) => console.log(err));
  }

  function updateTodo(id:number){
      navigate(`/todos/${id}`)
  }

  function addNewTodo(){
      navigate(`/todos/-1`)
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="TodoList container">
      <div>
      <h1>Manage your todos.</h1> <br />
      <table className="table">
        <thead>
          <tr>
            {/* <th>Id</th> */}
            <th>Description</th>
            <th>Is Done?</th>
            <th>Target Date</th>
            <th>Delete</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo:Todo) => (
            <tr key={todo.id}>
              {/* <td>{todo.id}</td> */}
              <td>{todo.description}</td>
              <td>{todo.done.toString()}</td>
              <td>{todo.targetDate.toString()}</td>
              <td>
                <button className="btn btn-danger" onClick={()=> deleteTodo(todo.id)}>DELETE</button>
              </td>
              <td>
                <button className="btn btn-warning" onClick={()=> updateTodo(todo.id)}>UPDATE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="btn btn-success m-5" onClick={addNewTodo}>
          Add New Todo
      </div>
    </div>
  );
}

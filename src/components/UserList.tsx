import { useState, useEffect } from "react";
import { getAllUsersApi, deleteUserApi} from "./api/UserApiService";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import { User } from "../types";
import React from "react";

export default function UserList() {

  useEffect(() =>{
    refreshUsers();
  }, [])
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  function refreshUsers() {
    getAllUsersApi()
      .then((response) => {
        console.log("API Response:", response);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function deleteUser(id:number){
    deleteUserApi(id)
        .then(() => {
          refreshUsers();
        })
        .catch((err) => console.log(err));
  }

  function updateUser(username:string){
      navigate(`/administrator/users/${username}`)
  }

  function addNewUser(){
      navigate(`/administrator/users/-1`)
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
    <div className="UsersList container">
      <div>
      <h1>Manage Users</h1> <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Is Admin?</th>
            <th>Delete</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.admin ? "true" : "false"}</td>
              <td>
                <button className="btn btn-danger" onClick={()=> deleteUser(user.id)}>DELETE</button>
              </td>
              <td>
                <button className="btn btn-warning" onClick={()=> updateUser(user.username)}>UPDATE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="btn btn-success m-5" onClick={addNewUser}>
          Add New User
      </div>
    </div>
  );
}

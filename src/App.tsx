import "./styles/App.css";
import "./styles/todoApp.css";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import Error from "./components/Error";
import TodoList from "./components/TodoList";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Logout from "./components/Logout";
import Todo from "./components/Todo";
import { Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import UserList from "./components/UserList";
import User from "./components/User";
import AdminRoute from "./components/security/AdminRoute";
import AuthenticatedRoute from "./components/security/AuthenticatedRoute";
import SignUp from "./components/SignUp";
import NonAuthenticatedRoute from "./components/security/NonAuthenticatedRoute";

function App() {
  return (
    <div className="App TodoApp wrapper">
      <div>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <NonAuthenticatedRoute>
                <Login />
              </NonAuthenticatedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <NonAuthenticatedRoute>
                <Login />
              </NonAuthenticatedRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <NonAuthenticatedRoute>
                <SignUp />
              </NonAuthenticatedRoute>
            }
          />
          <Route
            path="/welcome/:username"
            element={
              <AuthenticatedRoute>
                <Welcome />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/todos"
            element={
              <AuthenticatedRoute>
                <TodoList />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/todos/:id"
            element={
              <AuthenticatedRoute>
                <Todo />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <AuthenticatedRoute>
                <Logout />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthenticatedRoute>
                <Profile />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/administrator/users/:username"
            element={
              <AdminRoute>
                <User />
              </AdminRoute>
            }
          />
          <Route
            path="/administrator/users"
            element={
              <AdminRoute>
                <UserList />
              </AdminRoute>
            }
          />
          <Route
            path="/not-authorized"
            element={
              <Error
                message="You are NOT AUTHORIZED to see this page."
                status={403}
              />
            }
          />
          <Route
            path="/bad-request"
            element={
              <Error
                message="BAD REQUEST, you couldn't give what system wants :("
                status={400}
              />
            }
          />
          <Route
            path="/server-error"
            element={<Error message="It's not you it's us :(" status={500} />}
          />
          <Route
            path="*"
            element={
              <Error
                message="The page you want to reach NOT FOUND."
                status={404}
              />
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

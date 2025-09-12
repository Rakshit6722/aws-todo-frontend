import { User } from "../../types"
import { apiClient } from "./ApiClient"

export const getAllUsersApi = () => apiClient.get("/users")
// export const getUserByIdApi = (id) => apiClient.get(`/users/${id}`)
export const getUserByUsernameApi = (username:string) => apiClient.get(`/users/${username}`)
export const deleteUserApi = (id:number) => apiClient.delete(`/users/${id}`)
export const updateUserApi = (username:string, user:User) => apiClient.put(`/users/${username}`, user)
export const createUserApi = (user:User) => apiClient.post("/users", user)
export const signupApi = (user:User) => apiClient.post("/signup", user)
import { Todo } from "../../types"
import { apiClient } from "./ApiClient"

export const getAllTodosByUsernameApi = (username:string) => apiClient.get(`users/${username}/todos`)
export const getTodoApi = (username:string,id:number) => apiClient.get(`users/${username}/todos/${id}`)
export const deleteTodoApi = (username:string,id:number) => apiClient.delete(`users/${username}/todos/${id}`)
export const updateTodoApi = (username:string, id:number, todo:Todo) => {
    return apiClient.put(`users/${username}/todos/${id}`, todo)
        .catch(error => {
            if (error.response.status === 403) {
                throw new Error("You are not authorized to update this todo.");
            } else {
                throw error;
            }
        });
}
export const createTodoApi = (username:string, todo:Todo) => apiClient.post(`users/${username}/todos`, todo)

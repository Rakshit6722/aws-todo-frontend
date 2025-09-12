import { apiClient } from "./ApiClient";

export const executeJwtAuthenticationService = async (username:string, password:string) => {
    try {
        const response = await apiClient.post("/authenticate", {username, password});
        return response;
    } catch (error:any) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        throw error;
    }
};
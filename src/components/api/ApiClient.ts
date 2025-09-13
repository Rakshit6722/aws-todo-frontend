import axios from "axios"

export const apiClient = axios.create(
    {
        baseURL: 'https://dev.reachai.live/api',
        headers:{
            'Content-Type': 'application/json'
        }
    }
)
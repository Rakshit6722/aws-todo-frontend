import {
    getAllTodosByUsernameApi,
    getTodoApi,
    deleteTodoApi,
    updateTodoApi,
    createTodoApi,
  } from '../../components/api/TodoApiService';
  import { apiClient } from '../../components/api/ApiClient';
  
jest.mock('axios'); 
  
  describe('TodoApiService', () => {
    const username = 'user';
    const id = 1;
    const todo = {id, username, description:"Test Todo", done: false, targetDate: ""}
  
    it('should get all todos by username', async () => {
      const mockResponse = { data: [todo] };
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await getAllTodosByUsernameApi(username);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledWith(`users/${username}/todos`);
    });
  
    it('should get todo by id', async () => {
      const mockResponse = { data: todo };
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await getTodoApi(username, id);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledWith(`users/${username}/todos/${id}`);
    });
  
    it('should delete todo by id', async () => {
      const mockResponse = { data: 'Todo deleted' };
      (apiClient.delete as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await deleteTodoApi(username, id);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.delete).toHaveBeenCalledWith(`users/${username}/todos/${id}`);
    });
  
    it('should update todo', async () => {
      const mockResponse = { data: todo };
      (apiClient.put as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await updateTodoApi(username, id, todo);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.put).toHaveBeenCalledWith(`users/${username}/todos/${id}`, todo);
    });
  
    it('should create todo', async () => {
      const mockResponse = { data: todo };
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await createTodoApi(username, todo);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith(`users/${username}/todos`, todo);
    });
  });
  
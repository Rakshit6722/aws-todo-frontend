import {
    getAllUsersApi,
    getUserByUsernameApi,
    deleteUserApi,
    updateUserApi,
    createUserApi,
    signupApi,
  } from '../../components/api/UserApiService';
  import { apiClient } from '../../components/api/ApiClient';

jest.mock('axios'); 
  
  describe('UserApiService', () => {
    const username = 'user';
    const id = 1;
    const user = { id, username: 'user', password: 'pass', admin:false };
  
    it('should get all users', async () => {
      const mockResponse = { data: [user] };
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await getAllUsersApi();
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledWith('/users');
    });
  
    it('should get user by username', async () => {
      const mockResponse = { data: user };
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await getUserByUsernameApi(username);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledWith(`/users/${username}`);
    });
  
    it('should delete user by id', async () => {
      const mockResponse = { data: 'User deleted' };
      (apiClient.delete as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await deleteUserApi(id);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.delete).toHaveBeenCalledWith(`/users/${id}`);
    });
  
    it('should update user', async () => {
      const mockResponse = { data: user };
      (apiClient.put as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await updateUserApi(username, user);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.put).toHaveBeenCalledWith(`/users/${username}`, user);
    });
  
    it('should create user', async () => {
      const mockResponse = { data: user };
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await createUserApi(user);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/users', user);
    });
  
    it('should signup user', async () => {
      const mockResponse = { data: user };
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await signupApi(user);
  
      expect(response).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/signup', user);
    });
  });
  
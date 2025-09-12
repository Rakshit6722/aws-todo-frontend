import { executeJwtAuthenticationService } from '../../components/api/AuthenticationApiService';
import { apiClient } from '../../components/api/ApiClient';

jest.mock('axios'); 

describe('executeJwtAuthenticationService', () => {
  it('should return response on successful authentication', async () => {
    const mockResponse = { data: 'mockToken' };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const response = await executeJwtAuthenticationService('user', 'pass');

    expect(response).toEqual(mockResponse);
    expect(apiClient.post).toHaveBeenCalledWith('/authenticate', { username: 'user', password: 'pass' });
  });

  it('should throw error on authentication failure', async () => {
    const mockError = {
      response: {
        data: 'Unauthorized',
        status: 401,
        headers: {},
      },
    };
    (apiClient.post as jest.Mock).mockRejectedValue(mockError);

    await expect(executeJwtAuthenticationService('user', 'wrongpass')).rejects.toEqual(mockError);
    expect(apiClient.post).toHaveBeenCalledWith('/authenticate', { username: 'user', password: 'wrongpass' });
  });
});



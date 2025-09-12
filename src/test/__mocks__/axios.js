const axios = {
    create: jest.fn(() => axios),
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  };
  
  module.exports = axios;
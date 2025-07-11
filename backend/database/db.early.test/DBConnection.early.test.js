


const mongoose=require('mongoose');
const dotenv=require('dotenv');


// db.test.js
// Mocking mongoose and dotenv
jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe('DBConnection() DBConnection method', () => {
  let originalEnv;

  beforeAll(() => {
    // Save the original environment variables
    originalEnv = process.env;
  });

  beforeEach(() => {
    // Reset the environment variables before each test
    process.env = { ...originalEnv };
    dotenv.config.mockClear();
    mongoose.connect.mockClear();
  });

  afterAll(() => {
    // Restore the original environment variables
    process.env = originalEnv;
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should connect to the database successfully when MONGODB_URL is set', async () => {
      // Arrange
      process.env.MONGODB_URL = 'mongodb://localhost:27017/testdb';
      mongoose.connect.mockResolvedValueOnce();

      // Act
      await DBConnection();

      // Assert
      expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/testdb');
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle missing MONGODB_URL environment variable', async () => {
      // Arrange
      delete process.env.MONGODB_URL;

      // Act
      await DBConnection();

      // Assert
      expect(mongoose.connect).not.toHaveBeenCalled();
    });

    it('should handle mongoose connection failure', async () => {
      // Arrange
      process.env.MONGODB_URL = 'mongodb://localhost:27017/testdb';
      const error = new Error('Connection failed');
      mongoose.connect.mockRejectedValueOnce(error);

      // Act
      await DBConnection();

      // Assert
      expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/testdb');
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
    });
  });
});
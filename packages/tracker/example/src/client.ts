import { UserSchema } from './types';

import { UserSchema } from './types';

/**
 * API client for managing user operations
 */
export class ApiClient {
  private baseUrl: string;

  /**
   * Creates an instance of ApiClient
   * @param baseUrl - The base URL for the API endpoints
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * Retrieves a user by ID
   * @param id - The unique identifier of the user
   * @returns Promise resolving to the user data
   * @throws Will throw an error if the request fails
   */
  async getUser(id: string): Promise<UserSchema> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user: ${response.status} ${response.statusText}`);
      }

      const data: UserSchema = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting user: ${error.message}`);
      }
      throw new Error('An unknown error occurred while getting user');
    }
  }

  /**
   * Creates a new user
   * @param userData - The user data to create
   * @returns Promise resolving to the created user data
   * @throws Will throw an error if the request fails
   */
  async createUser(userData: Omit<UserSchema, 'id'>): Promise<UserSchema> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status} ${response.statusText}`);
      }

      const data: UserSchema = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating user: ${error.message}`);
      }
      throw new Error('An unknown error occurred while creating user');
    }
  }

  /**
   * Updates an existing user
   * @param id - The unique identifier of the user to update
   * @param userData - The user data to update
   * @returns Promise resolving to the updated user data
   * @throws Will throw an error if the request fails
   */
  async updateUser(id: string, userData: Partial<Omit<UserSchema, 'id'>>): Promise<UserSchema> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status} ${response.statusText}`);
      }

      const data: UserSchema = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating user: ${error.message}`);
      }
      throw new Error('An unknown error occurred while updating user');
    }
  }
}
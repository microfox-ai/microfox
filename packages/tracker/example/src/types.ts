export /**
 * Defines the shape of a user object for our API.
 */
export interface UserSchema {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
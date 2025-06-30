import { SunoAuthenticated } from '../sdk';
import dotenv from 'dotenv';

dotenv.config();

describe('SunoAuthenticated', () => {
  it('should attempt to login with Google', async () => {
    const email = process.env.SUNO_EMAIL;
    const password = process.env.SUNO_PASSWORD;

    if (!email || !password) {
      return;
      throw new Error(
        'SUNO_EMAIL and SUNO_PASSWORD environment variables are required in a .env file.',
      );
    }

    const suno = new SunoAuthenticated(email, password, {
      headless: false,
      providerType: 'google',
    });
    let loginError: any;
    try {
      await suno.login();
    } catch (error) {
      loginError = error;
    }

    expect(loginError).toBeDefined();

    await suno.close();
  }, 30000);
});

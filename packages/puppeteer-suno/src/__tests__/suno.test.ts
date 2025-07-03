import { SunoAuthenticated } from '../sdk';
import dotenv from 'dotenv';

dotenv.config();

describe('SunoAuthenticated', () => {
  // it('should attempt to login with Discord', async () => {
  //   const email = process.env.SUNO_DISCORD_EMAIL;
  //   const password = process.env.SUNO_DISCORD_PASSWORD;

  //   if (!email || !password) {
  //     throw new Error(
  //       'SUNO_EMAIL and SUNO_PASSWORD environment variables are required in a .env file.',
  //     );
  //   }

  //   const suno = new SunoAuthenticated(email, password, {
  //     headless: false,
  //     providerType: 'discord',
  //   });
  //   let loginError: any;
  //   try {
  //     await suno.login();
  //   } catch (error) {
  //     console.error(error);
  //     loginError = error;
  //   }

  //   expect(loginError).toBeUndefined();

  //   await suno.close();
  // }, 3000000);

  it('should fill music options and create a song', async () => {
    const email = process.env.SUNO_DISCORD_EMAIL;
    const password = process.env.SUNO_DISCORD_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'SUNO_EMAIL and SUNO_PASSWORD environment variables are required in a .env file.',
      );
    }

    const suno = new SunoAuthenticated(email, password, {
      headless: false,
      providerType: 'discord',
    });
    let error: any;
    try {
      await suno.login();
      await suno.generateMusic({
        lyrics: 'This is a test lyric for Suno automation.',
        style: 'pop, energetic',
        isInstrumental: false,
      });
    } catch (e) {
      error = e;
      console.error(e);
    }
    expect(error).toBeUndefined();
    await suno.close();
  }, 3000000);
});

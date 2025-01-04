import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export async function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    verify(
      token,
      configService.get('JWT_SECRET'),
      (err: any, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      },
    );
  });
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SiweMessage } from 'siwe';
import { PrismaService } from '../prisma/prisma.service';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getNonce(address: string) {
    const user = await this.prisma.user.upsert({
      where: { address: address.toLowerCase() },
      update: {},
      create: { address: address.toLowerCase() },
    });

    return { nonce: user.nonce };
  }

  async verify(message: string, signature: string) {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.validate(signature);
      
      const user = await this.prisma.user.findUnique({
        where: { address: fields.address.toLowerCase() },
      });

      if (!user || user.nonce !== fields.nonce) {
        throw new UnauthorizedException('Invalid nonce');
      }

      // Update nonce
      await this.prisma.user.update({
        where: { id: user.id },
        data: { nonce: ethers.utils.hexlify(ethers.utils.randomBytes(32)) },
      });

      const token = this.jwtService.sign({
        sub: user.id,
        address: user.address,
        role: user.role,
      });

      return { token };
    } catch (error) {
      throw new UnauthorizedException('Invalid signature');
    }
  }
}

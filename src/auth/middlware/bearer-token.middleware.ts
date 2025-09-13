import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Basic $token
      // Bearer $token
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        next();
        return;
      }

      const payload = this.parseBearerToken(authHeader);
      next();
      req.user = payload;
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
      next();
    }
  }

  async parseBearerToken(rawToken: string) {
    const token = this.validateBearerToken(rawToken);
    const decodedPayload = this.isDecodedPayload(token);
    const isRefreshToken = this.isRefreshToken(decodedPayload);

    const secretKey = isRefreshToken
      ? this.configService.get<string>('REFRESH_TOKEN_SECRET')
      : this.configService.get<string>('ACCESS_TOKEN_SECRET');

    const payload = await this.jwtService.verifyAsync(token, {
      secret: secretKey,
    });

    return payload;
  }

  private isRefreshToken(payload: any): boolean {
    if (payload.type === 'refresh') {
      return true;
    } else if (payload.type === 'access') {
      return false;
    } else {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }
  }

  private isDecodedPayload(token: string) {
    return this.jwtService.decode(token);
  }

  private validateBearerToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 유효하지 않습니다.');
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰 포맷이 유효하지 않습니다.');
    }

    return token;
  }
}

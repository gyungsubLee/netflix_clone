import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /// rawToken: Basic $token
  async register(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new BadRequestException('이미 가입한 이메일입니다.');
    }

    // 환경변수 처리: 해시 강도(HASH_ROUNDS) 기본값 10
    const saltRounds = Number(
      this.configService.get<number | string>('HASH_ROUNDS', 10),
    );

    const hash = await bcrypt.hash(password, saltRounds);

    await this.userRepository.save({
      email,
      password: hash,
    });

    return this.userRepository.findOne({
      where: { email },
    });
  }

  /// rawToken: Basic $token
  async login(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.authenticate(email, password);

    return {
      refreshToken: await this.issueToken(user, true),
      accessToken: await this.issueToken(user, false),
    };
  }

  async issueToken(user: { id: number; role: Role }, isRefreshToken: boolean) {
    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    const accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );

    return this.jwtService.signAsync(
      {
        sub: user.id,
        role: user.role,
        type: isRefreshToken ? 'refresh' : 'access',
      },
      {
        secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
        expiresIn: isRefreshToken ? '24h' : '300s',
      },
    );
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('잘못된 로그인 정보입니다.'); // 보안적 취약점이 될 수 있기 때문에, 이메일이라는 구체적 정보를 명시하지 않음
    }

    const passOk = await bcrypt.compare(password, user.password);

    if (!passOk) {
      throw new BadRequestException('잘못된 로그인 정보입니다.'); // 보안적 취약점이 될 수 있기 때문에, 이메일이라는 구체적 정보를 명시하지 않음
    }

    return user;
  }

  parseBasicToken(rawToken: string) {
    /**
     * 1) 토큰을 ' ' 기준으로 스플릿 한 후 토큰 값만 추출하기
     *  * Basic $token  ->  ['Basic', $token]
     */
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 유효하지 않습니다.');
    }

    const [basic, token] = basicSplit;

    if (basic.toLowerCase() !== 'basic') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    /**
     * 2) 추출한 토큰을 base64 디코딩해서 이메일과 비밀번호로 나눈다.
     *  * base64  ->  email:password  ->  ['email', 'password']
     */
    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    const inputInfo = decoded.split(':');

    console.log(inputInfo);

    if (inputInfo.length !== 2) {
      throw new BadRequestException('토큰 포맷이 유효하지 않습니다.');
    }

    const [email, password] = inputInfo;

    return {
      email,
      password,
    };
  }
}

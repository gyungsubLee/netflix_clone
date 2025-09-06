import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
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

    // 환경변수 처리: 해시 강도(BCRYPT_SALT_ROUNDS) 기본값 10
    const saltRounds = Number(
      this.configService.get<number | string>('BCRYPT_SALT_ROUNDS', 10),
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

  parseBasicToken(rawToken: string) {
    /**
     * 1) 토큰을 ' ' 기준으로 스플릿 한 후 토큰 값만 추출하기
     *  * Basic $token  ->  ['Basic', $token]
     */
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 유효하지 않습니다. 1');
    }

    const [_, token] = basicSplit;

    /**
     * 2) 추출한 토큰을 base64 디코딩해서 이메일과 비밀번호로 나눈다.
     *  * base64  ->  email:password  ->  ['email', 'password']
     */
    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    const inputInfo = decoded.split(':');

    console.log(inputInfo);

    if (inputInfo.length !== 2) {
      throw new BadRequestException('토큰 포맷이 유효하지 않습니다. 2');
    }

    const [email, password] = inputInfo;

    return {
      email,
      password,
    };
  }
}

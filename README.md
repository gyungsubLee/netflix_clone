# Netflix Clone API

NestJS 기반의 Netflix 스타일 영화 스트리밍 플랫폼 백엔드 API입니다. JWT 인증, RBAC 권한 관리, TypeORM을 활용한 PostgreSQL 데이터베이스 통합을 제공합니다.

## 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [설치 및 실행](#설치-및-실행)
- [환경 변수 설정](#환경-변수-설정)
- [API 엔드포인트](#api-엔드포인트)
- [프로젝트 구조](#프로젝트-구조)
- [개발 가이드](#개발-가이드)

## 주요 기능

### 인증 및 권한 관리
- JWT 기반 인증 시스템 (Access Token / Refresh Token)
- Basic Authentication을 통한 회원가입 및 로그인
- Passport.js 통합 (Local Strategy, JWT Strategy)
- RBAC(Role-Based Access Control) 권한 관리
  - **Admin**: 전체 시스템 관리 권한
  - **Paid User**: 유료 콘텐츠 접근 권한
  - **User**: 기본 사용자 권한

### 영화 관리
- 영화 CRUD 작업
- 영화 상세 정보 관리
- 제목 기반 검색 기능
- 감독 및 장르 연관 관리

### 데이터 관리
- TypeORM 기반 PostgreSQL 데이터베이스 통합
- Snake Case 네이밍 전략 자동 적용
- 트랜잭션 지원
- Query Builder 활용

### 보안 및 성능
- Bcrypt 기반 비밀번호 해싱
- 전역 인증 가드 및 RBAC 가드
- 응답 시간 모니터링
- 캐싱 인터셉터
- 전역 예외 필터

## 기술 스택

### Core Framework
- **NestJS** 11.x - Progressive Node.js framework
- **TypeScript** 5.x - Type-safe development
- **Node.js** - Runtime environment

### Database & ORM
- **PostgreSQL** - Relational database
- **TypeORM** 0.3.x - ORM framework
- **typeorm-naming-strategies** - Snake case naming convention

### Authentication & Security
- **Passport.js** - Authentication middleware
- **JWT** (JSON Web Tokens) - Token-based authentication
- **Bcrypt** - Password hashing

### Validation & Configuration
- **class-validator** - DTO validation
- **class-transformer** - Object transformation
- **Joi** - Environment variable validation

### Documentation
- **Swagger** - API documentation

### Development Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **SWC** - Fast TypeScript/JavaScript compiler

## 시스템 아키텍처

### 애플리케이션 레이어

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│              (HTTP/HTTPS Requests)                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                 Middleware Layer                     │
│  • BearerTokenMiddleware (Token Extraction)         │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   Guard Layer                        │
│  • AuthGuard (Authentication)                        │
│  • RBACGuard (Authorization)                         │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                Controller Layer                      │
│  • AuthController                                    │
│  • MovieController                                   │
│  • UserController                                    │
│  • DirectorController                                │
│  • GenreController                                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                  Service Layer                       │
│  • Business Logic                                    │
│  • Data Validation                                   │
│  • Transaction Management                            │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                Repository Layer                      │
│  • TypeORM Repositories                              │
│  • Query Builder                                     │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                  Database Layer                      │
│              PostgreSQL Database                     │
└─────────────────────────────────────────────────────┘
```

### 전역 기능

#### Interceptors (요청/응답 처리)
- **ResponseTimeInterceptor**: API 응답 시간 측정 및 로깅
- **CommonResponseInterceptor**: 통일된 응답 형식 제공
- **TransactionInterceptor**: 데이터베이스 트랜잭션 자동 관리
- **CacheInterceptor**: 응답 캐싱 (성능 최적화)

#### Exception Filters (예외 처리)
- **AllExceptionsFilter**: 전역 예외 처리
- **ForbiddenExceptionFilter**: 권한 관련 예외 처리
- **QueryFailedExceptionFilter**: 데이터베이스 쿼리 실패 처리

### 데이터베이스 스키마

#### 핵심 엔티티
- **User**: 사용자 정보 및 역할
- **Movie**: 영화 기본 정보
- **MovieDetail**: 영화 상세 정보
- **Director**: 감독 정보
- **Genre**: 장르 정보

## 설치 및 실행

### 사전 요구사항
- Node.js 18.x 이상
- PostgreSQL 13.x 이상
- npm 또는 pnpm

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd netflix_clone

# 의존성 설치
npm install
# 또는
pnpm install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정합니다:

```env
# Application Configuration
ENV=dev                    # 환경: dev | test | prod
PORT=3000                  # 서버 포트

# Database Configuration
DB_TYPE=postgres           # 데이터베이스 타입
DB_HOST=localhost          # 데이터베이스 호스트
DB_PORT=5432              # PostgreSQL 포트
DB_USERNAME=your_username  # 데이터베이스 사용자명
DB_PASSWORD=your_password  # 데이터베이스 비밀번호
DB_DATABASE=netflix_clone  # 데이터베이스 이름

# Security Configuration
HASH_ROUNDS=10            # Bcrypt 해싱 라운드 (10이 권장값)

# JWT Configuration
ACCESS_TOKEN_SECRET=your_secret_key_here      # Access Token 시크릿 키
REFRESH_TOKEN_SECRET=your_refresh_secret_here # Refresh Token 시크릿 키
```

**보안 권장사항:**
- `HASH_ROUNDS`: 10이 일반적인 값. 높을수록 안전하지만 느림
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`: 배포 시 랜덤하게 생성하고 주기적으로 변경
- 프로덕션 환경에서는 환경 변수를 파일이 아닌 시스템 환경 변수로 관리

### 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start:prod

# 디버그 모드
npm run start:debug
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 인증 (Authentication)

#### 사용자 회원가입
```http
POST /auth/register/user
Authorization: Basic <base64(email:password)>
```

#### 관리자 회원가입
```http
POST /auth/register/admin
Authorization: Basic <base64(email:password)>
```

#### 로그인
```http
POST /auth/login
Authorization: Basic <base64(email:password)>

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Access Token 갱신
```http
POST /auth/token/access
Authorization: Bearer <refresh_token>

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Passport 로그인
```http
POST /auth/login/passport
Authorization: Basic <base64(email:password)>
```

#### 인증 정보 확인
```http
GET /auth/private
Authorization: Bearer <access_token>
```

### 영화 (Movies)

#### 영화 목록 조회
```http
GET /movie?title={search_term}
# Public API - 인증 불필요

Response:
[
  {
    "id": 1,
    "title": "영화 제목",
    "detail": {
      "description": "영화 설명"
    },
    "director": {
      "id": 1,
      "name": "감독명"
    },
    "genres": [
      {
        "id": 1,
        "name": "장르명"
      }
    ]
  }
]
```

#### 영화 상세 조회
```http
GET /movie/:id
# Public API - 인증 불필요
```

#### 영화 생성
```http
POST /movie
Authorization: Bearer <access_token>
# Admin 권한 필요

Request Body:
{
  "title": "영화 제목",
  "detail": "영화 설명",
  "directorId": 1,
  "genreIds": [1, 2, 3]
}
```

#### 영화 수정
```http
PATCH /movie/:id
Authorization: Bearer <access_token>
# Admin 권한 필요

Request Body:
{
  "title": "수정된 제목",
  "detail": "수정된 설명"
}
```

#### 영화 삭제
```http
DELETE /movie/:id
Authorization: Bearer <access_token>
# Admin 권한 필요
```

### 감독 (Directors)

```http
GET    /director       # 감독 목록
GET    /director/:id   # 감독 상세
POST   /director       # 감독 생성 (Admin)
PATCH  /director/:id   # 감독 수정 (Admin)
DELETE /director/:id   # 감독 삭제 (Admin)
```

### 장르 (Genres)

```http
GET    /genre       # 장르 목록
GET    /genre/:id   # 장르 상세
POST   /genre       # 장르 생성 (Admin)
PATCH  /genre/:id   # 장르 수정 (Admin)
DELETE /genre/:id   # 장르 삭제 (Admin)
```

### 사용자 (Users)

```http
GET /user       # 사용자 목록 (Admin)
GET /user/:id   # 사용자 상세 (Admin)
```

## 프로젝트 구조

```
netflix_clone/
├── src/
│   ├── auth/                    # 인증 모듈
│   │   ├── decorator/           # 커스텀 데코레이터
│   │   │   ├── public.decorator.ts
│   │   │   └── rbac.decorator.ts
│   │   ├── guard/               # 인증/인가 가드
│   │   │   ├── auth.guard.ts
│   │   │   └── rbac.guard.ts
│   │   ├── middleware/          # 미들웨어
│   │   │   └── bearer-token.middleware.ts
│   │   ├── strategy/            # Passport 전략
│   │   │   ├── local.strategy.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── user/                    # 사용자 모듈
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   │
│   ├── movie/                   # 영화 모듈
│   │   ├── dto/
│   │   │   ├── create-movie.dto.ts
│   │   │   └── update-movie.dto.ts
│   │   ├── entities/
│   │   │   ├── movie.entity.ts
│   │   │   └── movie-detail.entity.ts
│   │   ├── movie.controller.ts
│   │   ├── movie.service.ts
│   │   └── movie.module.ts
│   │
│   ├── director/                # 감독 모듈
│   │   ├── entities/
│   │   │   └── director.entity.ts
│   │   ├── director.controller.ts
│   │   ├── director.service.ts
│   │   └── director.module.ts
│   │
│   ├── genre/                   # 장르 모듈
│   │   ├── entities/
│   │   │   └── genre.entity.ts
│   │   ├── genre.controller.ts
│   │   ├── genre.service.ts
│   │   └── genre.module.ts
│   │
│   ├── common/                  # 공통 모듈
│   │   ├── entity/
│   │   │   └── base-table.entity.ts
│   │   ├── filter/              # 예외 필터
│   │   │   ├── http-exception.filter.ts
│   │   │   ├── forbidden.filter.ts
│   │   │   └── query-failed.filter.ts
│   │   └── interceptor/         # 인터셉터
│   │       ├── response-time.interceptor.ts
│   │       ├── cache.interceptor.ts
│   │       ├── transaction.interceptor.ts
│   │       └── common-response.interceptor.ts
│   │
│   ├── app.module.ts            # 루트 모듈
│   └── main.ts                  # 애플리케이션 엔트리포인트
│
├── test/                        # E2E 테스트
├── .env                         # 환경 변수 (git 제외)
├── .eslintrc.js                 # ESLint 설정
├── .prettierrc                  # Prettier 설정
├── nest-cli.json                # Nest CLI 설정
├── package.json
├── tsconfig.json
└── README.md
```

## 개발 가이드

### 코드 스타일

프로젝트는 ESLint와 Prettier를 사용하여 일관된 코드 스타일을 유지합니다.

```bash
# 코드 포맷팅
npm run format

# 린트 검사 및 자동 수정
npm run lint
```

### 테스트

```bash
# 단위 테스트
npm run test

# 테스트 워치 모드
npm run test:watch

# 테스트 커버리지
npm run test:cov

# E2E 테스트
npm run test:e2e
```

### 새로운 모듈 추가

```bash
# 모듈 생성
nest g module <module-name>

# 컨트롤러 생성
nest g controller <module-name>

# 서비스 생성
nest g service <module-name>

# 전체 리소스 생성 (CRUD)
nest g resource <module-name>
```

### 데이터베이스 마이그레이션

프로젝트는 TypeORM의 `synchronize` 옵션을 사용합니다:
- **개발 환경**: `synchronize: true` (자동 스키마 동기화)
- **프로덕션 환경**: `synchronize: false` (수동 마이그레이션 필요)

**프로덕션 배포 시 주의사항:**
1. 데이터베이스 마이그레이션 스크립트 작성
2. `synchronize` 옵션 반드시 비활성화
3. 수동으로 마이그레이션 실행 및 검증

### 권한 관리

시스템은 3가지 역할(Role)을 지원합니다:

```typescript
export enum Role {
  admin = 0,      // 관리자 - 모든 권한
  paidUser = 1,   // 유료 사용자 - 유료 콘텐츠 접근
  user = 2        // 일반 사용자 - 기본 권한
}
```

#### RBAC 데코레이터 사용

```typescript
@RBAC(Role.admin)  // Admin만 접근 가능
@Post()
createMovie(@Body() dto: CreateMovieDto) {
  // ...
}

@Public()  // 인증 불필요
@Get()
getMovies() {
  // ...
}
```

### 인터셉터 활용

#### 트랜잭션 관리

`@Transaction` 데코레이터를 사용하여 자동 트랜잭션 관리:

```typescript
@Post()
@Transaction()
async createMovie(@Body() dto: CreateMovieDto, @Req() req) {
  // 이 메서드는 자동으로 트랜잭션 내에서 실행됨
  // 에러 발생 시 자동 롤백
}
```

### 응답 직렬화

민감한 정보(비밀번호 등)는 `@Exclude` 데코레이터로 제외:

```typescript
@Column()
@Exclude({ toPlainOnly: true })
password: string;
```

컨트롤러에서 `ClassSerializerInterceptor` 활성화:

```typescript
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  // ...
}
```

## 개발 로드맵

### 구현 완료
- ✅ JWT 인증 시스템
- ✅ RBAC 권한 관리
- ✅ 영화 CRUD
- ✅ 감독/장르 관리
- ✅ 트랜잭션 지원
- ✅ 전역 예외 처리
- ✅ 응답 시간 모니터링

### 개발 예정
- 🔄 영화 평점 및 리뷰 시스템
- 🔄 사용자 찜 목록
- 🔄 영화 추천 알고리즘
- 🔄 파일 업로드 (포스터, 썸네일)
- 🔄 Swagger API 문서화 완성
- 🔄 단위 테스트 및 E2E 테스트 확대

## 라이선스

UNLICENSED - 개인 학습 프로젝트

## 문의

프로젝트 관련 문의사항은 이슈를 통해 등록해주세요.

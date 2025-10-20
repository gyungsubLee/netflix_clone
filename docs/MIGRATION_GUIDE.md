# Movie likeCount 컬럼 마이그레이션 가이드

## 개요
Movie 엔티티에 `likeCount` 컬럼을 추가하고 기존 250개의 더미 데이터에 랜덤 좋아요 수를 할당하는 마이그레이션입니다.

## 변경 사항

### 1. 엔티티 변경
- **파일**: `src/movie/entities/movie.entity.ts`
- **변경 내용**: `likeCount` 컬럼 추가 (기본값: 0)

```typescript
@Column({
  default: 0,
})
likeCount: number;
```

### 2. 데이터베이스 스키마 변경
- TypeORM의 `synchronize` 기능으로 자동 적용됨
- 컬럼명: `like_count` (snake_case)
- 타입: INTEGER
- 기본값: 0
- NULL 허용: NO

## 마이그레이션 실행 방법

### Step 1: 애플리케이션 재시작 (컬럼 생성)

```bash
# 개발 모드로 애플리케이션 실행
npm run start:dev
```

TypeORM의 `synchronize: true` 설정으로 인해 자동으로 `like_count` 컬럼이 생성됩니다.

### Step 2: Docker 컨테이너 ID 확인

```bash
docker ps | grep postgres
```

출력 예시:
```
5f8b52ba4134   postgres:latest   "docker-entrypoint.s…"   ...
```

### Step 3: SQL 마이그레이션 스크립트 실행

#### 방법 1: Docker 내부에서 실행

```bash
# 컨테이너 접속
docker exec -it 5f8b52ba4134 bash

# 마이그레이션 파일 복사 (호스트에서 실행)
docker cp docs/add-like-count-migration.sql 5f8b52ba4134:/tmp/

# psql로 실행
psql -U myapp -d myapp -f /tmp/add-like-count-migration.sql
```

#### 방법 2: Docker 외부에서 직접 실행 (권장)

```bash
docker exec -i 5f8b52ba4134 psql -U myapp -d myapp < docs/add-like-count-migration.sql
```

### Step 4: 결과 확인

마이그레이션 스크립트가 자동으로 다음 정보를 출력합니다:

1. **전체 통계**
   - 총 영화 수
   - 최소/최대/평균/중앙값 좋아요 수

2. **좋아요 수 분포**
   - 0-1000 (일반): 약 80%
   - 1001-5000 (인기): 약 15%
   - 5001-10000 (매우 인기): 약 5%

3. **상위/하위 10개 영화**

### Step 5: API 테스트 (선택 사항)

```bash
# 좋아요 수로 정렬 확인 (내림차순)
curl "http://localhost:3000/movie?order=likeCount_DESC"

# 좋아요 수로 정렬 확인 (오름차순)
curl "http://localhost:3000/movie?order=likeCount_ASC"

# 복합 정렬 (좋아요 + ID)
curl "http://localhost:3000/movie?order=likeCount_DESC,id_ASC"
```

## 데이터 분포 전략

### 현실적인 좋아요 수 분포 적용

```
┌─────────────────┬──────────┬────────────┐
│   좋아요 범위    │  비율    │  영화 수   │
├─────────────────┼──────────┼────────────┤
│ 0 ~ 1000       │   80%   │   ~200개   │
│ 1001 ~ 5000    │   15%   │   ~38개    │
│ 5001 ~ 10000   │    5%   │   ~12개    │
└─────────────────┴──────────┴────────────┘
```

### 랜덤 분포 로직

```sql
CASE
  WHEN rn <= (total_count * 0.8) THEN
    FLOOR(RANDOM() * 1001)::INTEGER           -- 0 ~ 1000
  WHEN rn <= (total_count * 0.95) THEN
    FLOOR(RANDOM() * 4000 + 1001)::INTEGER    -- 1001 ~ 5000
  ELSE
    FLOOR(RANDOM() * 5000 + 5001)::INTEGER    -- 5001 ~ 10000
END
```

## 롤백 방법

만약 마이그레이션을 되돌려야 한다면:

```sql
-- likeCount를 0으로 초기화
UPDATE movie SET like_count = 0;

-- 또는 컬럼 삭제 (주의: 데이터 손실)
ALTER TABLE movie DROP COLUMN like_count;
```

## 주의사항

1. **운영 환경**: 실제 운영 환경에서는 `synchronize: false`로 설정하고 별도의 마이그레이션 도구를 사용하세요.
2. **백업**: 운영 데이터베이스에 적용하기 전에 반드시 백업하세요.
3. **트랜잭션**: 이 스크립트는 트랜잭션 내에서 실행되므로 오류 발생 시 자동으로 롤백됩니다.

## 검증 쿼리

### 기본 검증

```sql
-- 모든 영화의 likeCount 확인
SELECT id, title, like_count
FROM movie
ORDER BY like_count DESC
LIMIT 20;

-- NULL 값 확인
SELECT COUNT(*)
FROM movie
WHERE like_count IS NULL;
```

### 통계 검증

```sql
-- 좋아요 분포 확인
SELECT
    MIN(like_count) as min,
    MAX(like_count) as max,
    AVG(like_count)::INTEGER as avg,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY like_count) as median
FROM movie;
```

## 관련 파일

- **엔티티**: `src/movie/entities/movie.entity.ts`
- **마이그레이션 스크립트**: `docs/add-like-count-migration.sql`
- **초기 더미 데이터**: `docs/seed-movies-250.sql`
- **가이드 문서**: `docs/MIGRATION_GUIDE.md`

## 문제 해결

### Q1: "like_count 컬럼이 존재하지 않습니다" 오류

**원인**: TypeORM synchronize가 실행되지 않음

**해결**:
```bash
# 애플리케이션 재시작
npm run start:dev
```

### Q2: 권한 오류 (permission denied)

**원인**: 데이터베이스 사용자 권한 부족

**해결**:
```bash
# 올바른 사용자로 연결 확인
docker exec -it [CONTAINER_ID] psql -U myapp -d myapp
```

### Q3: Docker 컨테이너 ID를 모를 때

```bash
# PostgreSQL 컨테이너 찾기
docker ps --filter "ancestor=postgres"

# 또는 모든 컨테이너 확인
docker ps -a
```

## 추가 고려사항

### Cursor Pagination 지원

선택하신 코드 블록에서 볼 수 있듯이, `likeCount`는 이미 정렬 파라미터로 사용 가능합니다:

```typescript
// 예시: order=["likeCount_DESC", "id_DESC"]
qb.orderBy(`${qb.alias}.likeCount`, 'DESC');
qb.addOrderBy(`${qb.alias}.id`, 'DESC');
```

### 인덱스 추가 권장 (선택)

많은 양의 데이터에서 `likeCount`로 정렬할 경우 성능 향상을 위해 인덱스 추가를 고려하세요:

```sql
CREATE INDEX idx_movie_like_count ON movie(like_count DESC);
```

## 완료 체크리스트

- [ ] Movie 엔티티에 `likeCount` 컬럼 추가됨
- [ ] 애플리케이션 재시작하여 스키마 동기화
- [ ] 마이그레이션 스크립트 실행 완료
- [ ] 데이터 분포 확인 (80% / 15% / 5%)
- [ ] API 정렬 테스트 완료
- [ ] 검증 쿼리 실행 확인

---

**마지막 업데이트**: 2025-10-20

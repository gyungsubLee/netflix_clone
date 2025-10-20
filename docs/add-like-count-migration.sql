-- ============================================
-- Movie 엔티티에 likeCount 컬럼 추가 및 더미 데이터 업데이트
-- ============================================
--
-- 전제 조건:
--   1. Movie 엔티티에 likeCount 컬럼이 추가되어 있어야 함
--   2. TypeORM synchronize가 실행되어 like_count 컬럼이 생성되어 있어야 함
--
-- 실행 방법:
--   docker exec -it [CONTAINER_ID] psql -U myapp -d myapp -f /path/to/add-like-count-migration.sql
--
-- 또는 Docker 외부에서:
--   docker exec -i [CONTAINER_ID] psql -U myapp -d myapp < docs/add-like-count-migration.sql
-- ============================================


-- ============================================
-- 1. 컬럼 존재 여부 확인 (이미 synchronize로 생성되었을 것으로 예상)
-- ============================================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'movie'
        AND column_name = 'like_count'
    ) THEN
        RAISE NOTICE 'like_count 컬럼이 이미 존재합니다.';
    ELSE
        RAISE EXCEPTION 'like_count 컬럼이 존재하지 않습니다. 먼저 애플리케이션을 실행하여 TypeORM synchronize를 통해 컬럼을 생성해주세요.';
    END IF;
END $$;


-- ============================================
-- 2. 기존 Movie 데이터에 랜덤 likeCount 값 업데이트
-- ============================================
-- 0부터 10000 사이의 랜덤 좋아요 수 설정
-- 더 현실적인 분포를 위해 다음과 같이 설정:
--   - 80% 영화: 0 ~ 1000 사이
--   - 15% 영화: 1001 ~ 5000 사이
--   - 5% 영화: 5001 ~ 10000 사이 (인기 영화)

WITH movie_ids AS (
    SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY id) as rn,
        COUNT(*) OVER () as total_count
    FROM movie
    WHERE like_count IS NULL OR like_count = 0
),
like_count_distribution AS (
    SELECT
        id,
        CASE
            -- 80% 영화: 0 ~ 1000
            WHEN rn <= (total_count * 0.8) THEN
                FLOOR(RANDOM() * 1001)::INTEGER
            -- 15% 영화: 1001 ~ 5000
            WHEN rn <= (total_count * 0.95) THEN
                FLOOR(RANDOM() * 4000 + 1001)::INTEGER
            -- 5% 영화: 5001 ~ 10000 (인기 영화)
            ELSE
                FLOOR(RANDOM() * 5000 + 5001)::INTEGER
        END as new_like_count
    FROM movie_ids
)
UPDATE movie
SET like_count = lcd.new_like_count
FROM like_count_distribution lcd
WHERE movie.id = lcd.id;


-- ============================================
-- 3. 업데이트 결과 확인
-- ============================================

-- 전체 통계
SELECT
    COUNT(*) as total_movies,
    MIN(like_count) as min_likes,
    MAX(like_count) as max_likes,
    ROUND(AVG(like_count)::NUMERIC, 2) as avg_likes,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY like_count) as median_likes
FROM movie;

-- 좋아요 수 분포
SELECT
    CASE
        WHEN like_count BETWEEN 0 AND 1000 THEN '0-1000 (일반)'
        WHEN like_count BETWEEN 1001 AND 5000 THEN '1001-5000 (인기)'
        WHEN like_count BETWEEN 5001 AND 10000 THEN '5001-10000 (매우 인기)'
        ELSE '기타'
    END as like_range,
    COUNT(*) as movie_count,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ())::NUMERIC, 2) as percentage
FROM movie
GROUP BY like_range
ORDER BY MIN(like_count);

-- 상위 10개 인기 영화
SELECT
    id,
    title,
    like_count
FROM movie
ORDER BY like_count DESC
LIMIT 10;

-- 하위 10개 영화
SELECT
    id,
    title,
    like_count
FROM movie
ORDER BY like_count ASC
LIMIT 10;


-- ============================================
-- 완료 메시지
-- ============================================
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO updated_count FROM movie WHERE like_count > 0;
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'likeCount 마이그레이션 완료!';
    RAISE NOTICE '업데이트된 영화 수: %', updated_count;
    RAISE NOTICE '==================================================';
END $$;

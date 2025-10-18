-- ============================================
-- Movie 엔티티 250개 더미 데이터 생성 SQL (PostgreSQL)
-- ============================================
--
-- 전제 조건:
--   1. user 테이블에 id=1 레코드 존재
--   2. director 테이블에 최소 10개 레코드 존재
--   3. genre 테이블에 최소 5개 레코드 존재
--   4. movie_detail 테이블에 250개 레코드 존재
--
-- 실행 순서:
--   1. MovieDetail 250개 생성 (이미 존재하는 경우 생략)
--   2. Movie 250개 생성 (MovieDetail과 1:1 매핑)
--   3. Movie-Genre 관계 설정 (N:M)
-- ============================================

-- ============================================
-- 1. MovieDetail 250개 생성
-- ============================================
INSERT INTO movie_detail (detail) VALUES
  ('An epic tale of adventure and discovery in uncharted territories'),
  ('A heartwarming story about family bonds and redemption'),
  ('A thrilling sci-fi journey through space and time'),
  ('A romantic comedy set in the bustling streets of New York'),
  ('A gripping crime drama with unexpected twists'),
  ('An action-packed superhero origin story'),
  ('A psychological thriller that keeps you on edge'),
  ('A historical drama depicting ancient civilizations'),
  ('A musical celebration of life and love'),
  ('A documentary-style exploration of nature''s wonders'),
  ('A mystery-solving adventure in a haunted mansion'),
  ('A sports drama about overcoming adversity'),
  ('A coming-of-age story set in rural America'),
  ('A fantasy epic with dragons and magic'),
  ('A noir detective thriller in 1940s Los Angeles'),
  ('A disaster movie with breathtaking visual effects'),
  ('A war epic depicting heroism and sacrifice'),
  ('A biographical film about a legendary musician'),
  ('A horror film set in an abandoned asylum'),
  ('A political thriller exposing government secrets'),
  ('An animated adventure for the whole family'),
  ('A survival story stranded on a deserted island'),
  ('A heist film with an elaborate master plan'),
  ('A western showdown in the old frontier'),
  ('A submarine thriller in the depths of the ocean'),
  ('A courtroom drama fighting for justice'),
  ('A monster movie threatening humanity'),
  ('A time-travel paradox adventure'),
  ('A revenge tale spanning decades'),
  ('A espionage thriller during the Cold War'),
  ('A dance competition film with stunning choreography'),
  ('A racing drama on the Formula 1 circuit'),
  ('A prison escape thriller'),
  ('A martial arts epic in ancient China'),
  ('A zombie apocalypse survival story'),
  ('A superhero team assembling to save the world'),
  ('A space exploration mission to Mars'),
  ('A haunted house paranormal investigation'),
  ('A treasure hunt across exotic locations'),
  ('A cyberpunk dystopian future'),
  ('A boxing underdog story'),
  ('A corporate espionage thriller'),
  ('A vampire love story across centuries'),
  ('A alien invasion defense saga'),
  ('A circus performer drama'),
  ('A magical realism journey'),
  ('A sailing adventure on the high seas'),
  ('A aviation disaster thriller'),
  ('A hostage negotiation tense standoff'),
  ('A art heist in famous museums'),
  ('A wilderness survival against predators'),
  ('A robotics AI uprising scenario'),
  ('A time loop mystery'),
  ('A cult investigation thriller'),
  ('A pandemic outbreak response'),
  ('A ice age survival story'),
  ('A volcanic eruption disaster'),
  ('A carnival mystery'),
  ('A ballet performance drama'),
  ('A poker championship thriller'),
  ('A Olympic athlete journey'),
  ('A mountain climbing expedition'),
  ('A deep sea diving adventure'),
  ('A archaeological discovery'),
  ('A fashion industry exposé'),
  ('A cooking competition drama'),
  ('A wilderness firefighting heroics'),
  ('A tornado chasing thriller'),
  ('A earthquake survival'),
  ('A meteor impact scenario'),
  ('A virtual reality adventure'),
  ('A gaming championship story'),
  ('A musical prodigy journey'),
  ('A circus animal rescue'),
  ('A zoo keeper adventure'),
  ('A safari expedition thriller'),
  ('A arctic exploration'),
  ('A desert survival ordeal'),
  ('A jungle expedition'),
  ('A cave exploration mystery'),
  ('A lighthouse keeper isolation'),
  ('A fishing boat storm survival'),
  ('A oil rig disaster'),
  ('A train heist thriller'),
  ('A airplane hijacking drama'),
  ('A car chase action'),
  ('A motorcycle gang story'),
  ('A bicycle racing drama'),
  ('A skateboarding culture film'),
  ('A surfing championship'),
  ('A skiing competition'),
  ('A ice skating performance'),
  ('A gymnastics Olympic dream'),
  ('A swimming championship'),
  ('A track and field triumph'),
  ('A wrestling drama'),
  ('A tennis rivalry'),
  ('A golf tournament thriller'),
  ('A baseball underdog season'),
  ('A basketball championship run'),
  ('A football Super Bowl journey'),
  ('A soccer World Cup quest'),
  ('A hockey playoff battle'),
  ('A cricket match thriller'),
  ('A rugby world cup'),
  ('A volleyball beach championship'),
  ('A bowling tournament'),
  ('A chess grandmaster rivalry'),
  ('A poker world series'),
  ('A billiards championship'),
  ('A darts competition'),
  ('A fishing tournament'),
  ('A hunting expedition'),
  ('A birdwatching adventure'),
  ('A photography safari'),
  ('A painting masterpiece creation'),
  ('A sculpture exhibition'),
  ('A poetry slam competition'),
  ('A novel writing journey'),
  ('A journalism investigation'),
  ('A radio broadcasting drama'),
  ('A television production behind scenes'),
  ('A theater performance preparation'),
  ('A opera singer rise'),
  ('A conductor symphony'),
  ('A jazz musician story'),
  ('A rock band formation'),
  ('A country music stardom'),
  ('A hip hop artist journey'),
  ('A electronic music DJ'),
  ('A classical pianist virtuoso'),
  ('A violin prodigy'),
  ('A cello masterclass'),
  ('A drum solo performance'),
  ('A guitar legendary'),
  ('A saxophone blues'),
  ('A trumpet jazz'),
  ('A harmonica folk'),
  ('A accordion traditional'),
  ('A bagpipe highland'),
  ('A didgeridoo aboriginal'),
  ('A sitar classical Indian'),
  ('A koto Japanese traditional'),
  ('A erhu Chinese'),
  ('A balalaika Russian'),
  ('A ukulele Hawaiian'),
  ('A banjo bluegrass'),
  ('A mandolin folk'),
  ('A harp classical'),
  ('A organ church'),
  ('A synthesizer electronic'),
  ('A theremin experimental'),
  ('A steel drum Caribbean'),
  ('A marimba percussion'),
  ('A xylophone orchestra'),
  ('A timpani symphony'),
  ('A tabla Indian rhythm'),
  ('A djembe African drumming'),
  ('A taiko Japanese drumming'),
  ('A steelpan band'),
  ('A marching band competition'),
  ('A choir gospel'),
  ('A acapella group'),
  ('A barbershop quartet'),
  ('A karaoke competition'),
  ('A talent show'),
  ('A magic show performance'),
  ('A comedy stand-up special'),
  ('A improv theater'),
  ('A puppet show'),
  ('A ventriloquist act'),
  ('A juggling circus'),
  ('A acrobat performance'),
  ('A trapeze artist'),
  ('A tightrope walker'),
  ('A fire breather'),
  ('A sword swallower'),
  ('A escape artist'),
  ('A illusionist show'),
  ('A mime performance'),
  ('A clown entertainment'),
  ('A street performer'),
  ('A busker musician'),
  ('A graffiti artist'),
  ('A breakdancer competition'),
  ('A parkour chase'),
  ('A freerunning showcase'),
  ('A BMX stunt riding'),
  ('A motocross racing'),
  ('A drag racing'),
  ('A rally championship'),
  ('A drift racing'),
  ('A karting competition'),
  ('A monster truck show'),
  ('A demolition derby'),
  ('A truck pulling contest'),
  ('A tractor racing'),
  ('A boat racing'),
  ('A jet ski championship'),
  ('A kayak expedition'),
  ('A canoe journey'),
  ('A rafting adventure'),
  ('A rowing competition'),
  ('A sailing regatta'),
  ('A yacht racing'),
  ('A windsurfing championship'),
  ('A kitesurfing competition'),
  ('A scuba diving exploration'),
  ('A snorkeling adventure'),
  ('A freediving record'),
  ('A spearfishing tournament'),
  ('A underwater photography'),
  ('A marine biology research'),
  ('A oceanography expedition'),
  ('A coral reef conservation'),
  ('A whale watching journey'),
  ('A dolphin encounter'),
  ('A shark diving thriller'),
  ('A jellyfish documentary'),
  ('A octopus intelligence study'),
  ('A sea turtle migration'),
  ('A penguin colony observation'),
  ('A seal sanctuary'),
  ('A polar bear expedition'),
  ('A elephant conservation'),
  ('A lion pride documentary'),
  ('A tiger rescue mission'),
  ('A leopard tracking'),
  ('A cheetah speed study'),
  ('A gorilla habitat research'),
  ('A chimpanzee behavior study'),
  ('A orangutan conservation'),
  ('A panda breeding program'),
  ('A koala rescue'),
  ('A kangaroo wildlife'),
  ('A crocodile handling'),
  ('A snake charmer'),
  ('A spider research'),
  ('A butterfly migration'),
  ('A bee colony documentary'),
  ('A ant colony study'),
  ('A dragonfly observation'),
  ('A firefly phenomenon'),
  ('A beetle collection'),
  ('A moth night photography'),
  ('A bird migration tracking'),
  ('A eagle soaring documentary'),
  ('A owl nocturnal study'),
  ('A parrot intelligence research'),
  ('A peacock display'),
  ('A flamingo colony'),
  ('A hummingbird flight study'),
  ('A albatross ocean journey'),
  ('A penguin arctic survival');


-- ============================================
-- 1-1. Genre 5개 생성 (선행 조건)
-- ============================================
INSERT INTO genre (name, created_at, updated_at, version)
VALUES
  ('Action', NOW(), NOW(), 1),
  ('Drama', NOW(), NOW(), 1),
  ('Comedy', NOW(), NOW(), 1),
  ('Thriller', NOW(), NOW(), 1),
  ('Sci-Fi', NOW(), NOW(), 1)
ON CONFLICT DO NOTHING;

-- ============================================
-- 1-2. Director 10개 생성 (선행 조건)
-- ============================================
INSERT INTO director (name, dob, nationality, created_at, updated_at, version)
VALUES
  ('Steven Spielberg', '1946-12-18', 'USA', NOW(), NOW(), 1),
  ('Christopher Nolan', '1970-07-30', 'UK', NOW(), NOW(), 1),
  ('Quentin Tarantino', '1963-03-27', 'USA', NOW(), NOW(), 1),
  ('Martin Scorsese', '1942-11-17', 'USA', NOW(), NOW(), 1),
  ('James Cameron', '1954-08-16', 'Canada', NOW(), NOW(), 1),
  ('Ridley Scott', '1937-11-30', 'UK', NOW(), NOW(), 1),
  ('Peter Jackson', '1961-10-31', 'New Zealand', NOW(), NOW(), 1),
  ('Denis Villeneuve', '1967-10-03', 'Canada', NOW(), NOW(), 1),
  ('Greta Gerwig', '1983-08-04', 'USA', NOW(), NOW(), 1),
  ('Bong Joon-ho', '1969-09-14', 'South Korea', NOW(), NOW(), 1)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. Movie 250개 생성
-- ============================================
-- TypeORM이 생성한 실제 컬럼명 사용 (snake_case with underscore)
-- version 컬럼은 기본값 1로 설정
-- 이미 사용 중인 detail_id는 제외하고 생성
-- director_id는 실제 존재하는 director ID 목록에서 순환 할당

WITH available_details AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
  FROM movie_detail
  WHERE id NOT IN (SELECT detail_id FROM movie WHERE detail_id IS NOT NULL)
  LIMIT 250
),
available_directors AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM director
),
director_count AS (
  SELECT COUNT(*) as total FROM director
)
INSERT INTO movie (title, creator_id, director_id, detail_id, created_at, updated_at, version)
SELECT
  'Movie Title ' || ad.rn as title,
  1,
  adir.id,
  ad.id,
  NOW(),
  NOW(),
  1
FROM available_details ad
CROSS JOIN director_count dc
JOIN available_directors adir ON adir.rn = ((ad.rn - 1) % dc.total) + 1;


-- ============================================
-- 3. Movie-Genre 관계 설정 (N:M)
-- ============================================
-- 각 영화당 1-3개의 장르를 랜덤으로 할당
-- - 모든 영화: 1개 장르
-- - 짝수 id 영화: 추가 1개 장르 (총 2개)
-- - 3의 배수 id 영화: 추가 1개 장르 (총 3개)
-- 중복 방지를 위해 ON CONFLICT DO NOTHING 추가
-- 실제 존재하는 genre ID를 사용하기 위해 동적으로 매핑

-- TypeORM이 생성한 실제 컬럼명 사용 (movie_id, genre_id)
WITH genre_list AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM genre
),
genre_count AS (
  SELECT COUNT(*) as total FROM genre
)
INSERT INTO movie_genres_genre (movie_id, genre_id)
SELECT m.id, gl.id
FROM movie m
CROSS JOIN genre_count gc
JOIN genre_list gl ON gl.rn = ((m.id - 1) % gc.total) + 1
UNION ALL
SELECT m.id, gl.id
FROM movie m
CROSS JOIN genre_count gc
JOIN genre_list gl ON gl.rn = ((m.id) % gc.total) + 1
WHERE m.id % 2 = 0
UNION ALL
SELECT m.id, gl.id
FROM movie m
CROSS JOIN genre_count gc
JOIN genre_list gl ON gl.rn = ((m.id + 1) % gc.total) + 1
WHERE m.id % 3 = 0
ON CONFLICT DO NOTHING;


-- ============================================
-- 조정 가이드
-- ============================================
--
-- 1. Creator ID 변경:
--    creator_id 값을 실제 존재하는 user.id로 변경
--    예: 1 → 3
--
-- 2. Director 개수 조정:
--    ((num - 1) % 10) + 1 에서 10을 실제 director 개수로 변경
--    예: director가 5명이면 → ((num - 1) % 5) + 1
--
-- 3. Genre 개수 조정:
--    ((m.id - 1) % 5) + 1 에서 5를 실제 genre 개수로 변경
--    예: genre가 8개이면 → ((m.id - 1) % 8) + 1
--
-- 4. 영화 제목 커스터마이징:
--    'Movie Title ' || num을 원하는 형식으로 변경
--    예: 'Netflix Original ' || num
--
-- ============================================


-- ============================================
-- 검증 쿼리
-- ============================================

-- 생성된 데이터 확인:
SELECT COUNT(*) as total_movies FROM movie;
SELECT COUNT(*) as total_details FROM movie_detail;
SELECT COUNT(*) as total_relations FROM movie_genres_genre;

-- 각 영화의 장르 개수 확인:
SELECT
  m.id,
  m.title,
  COUNT(mgg.genre_id) as genre_count
FROM movie m
LEFT JOIN movie_genres_genre mgg ON m.id = mgg.movie_id
GROUP BY m.id, m.title
ORDER BY m.id
LIMIT 20;

-- ============================================

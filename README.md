### 환경변수 설정

```env
# App
ENV=dev # test, dev, prod
PORT=3000

# DB
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# Hash
HASH_ROUNDS=10  # 10 일반적인 bcrypt hash rounds 값이다. 해당 값보다 커지면 해싱 처리가 느려지고, 낮으면 빨라진다.

# JWT
 # 베포 시, 해당 값을 랜덤하게 설정하고 주기적으로 변경하는 것이 좋다.
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

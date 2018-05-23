# millionaire

## Dependencies

- Node.js
- PostgreSQL
- [Caddy](https://caddyserver.com)

## Building

### 1. Install dependencies
```bash
npm install
```

### 2. Build JS/CSS

```bash
make
```

## Running

### 1. Database

#### 1.1. Credentials

Either set up a user/database according to [bootstrap/database.js](./src/bootstrap/database.js) or change the credentials in that file.

#### 1.2. Import Data

Run the following SQL files in the given order:

- [data/schema.sql](./data/schema.sql)
- [data/questions.sql](./data/questions.sql)

#### 1.3. Create admin user

To create an admin user, run the following script which will output a hash for a given password. For example with the password `password`:

```bash
./scripts/generate-hash.js password
```

Then run the following SQL snippet to create the user:

```sql
INSERT INTO mill.admin (username, password) VALUES (
  'admin',
  'PASSWORD_HASH_GOES_HERE'
);
```

### 2. Starting node server

The  backend runs on port `3000`.
Run the following to start:

```
npm start
```

### 3. Starting Caddy

Caddy proxies requests to the backend and serves the static files. Run the following to start:

```
caddy
```
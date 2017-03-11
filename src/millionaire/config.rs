use std::env;

const DEFAULT_REDIS_URL: &'static str = "redis://127.0.0.1";
const DEFAULT_POSTGRES_URL: &'static str = "postgres://postgres@localhost";

#[derive(Debug)]
pub struct Config {
    redis_url: String,
    postgres_url: String
}

impl Config {
    pub fn new<S: Into<String>>(redis_url: S, postgres_url: S) -> Self {
        Config { redis_url: redis_url.into(), postgres_url: postgres_url.into() }
    }

    pub fn from_env() -> Self {
        let redis_url = match env::var_os("REDIS_URL") {
            Some(value) => value.into_string().unwrap(),
            None => DEFAULT_REDIS_URL.to_string()
        };

        let postgres_url = match env::var_os("POSTGRES_URL") {
            Some(value) => value.into_string().unwrap(),
            None => DEFAULT_POSTGRES_URL.to_string()
        };

        Config::new(redis_url, postgres_url)
    }

    pub fn redis_url(&self) -> &str {
        &self.redis_url
    }

    pub fn postgres_url(&self) -> &str {
        &self.postgres_url
    }
}

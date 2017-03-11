extern crate iron;

mod millionaire;

use millionaire::config::Config;
use millionaire::server::Server;

fn main() {
    let config = Config::from_env();
    let server = Server::new(&config);

    let listening = server.http(("127.0.0.1", 8080)).unwrap();

    println!("Listening on {}", listening.socket);
}

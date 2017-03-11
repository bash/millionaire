use std::net::ToSocketAddrs;

use iron::error::HttpResult;
use iron::Listening;
use iron::prelude::*;
use iron::status::Status;

use super::config::Config;

pub struct Server<'a> {
    config: &'a Config
}

impl<'a> Server<'a> {
    pub fn new(config: &'a Config) -> Self {
        Server { config: config }
    }

    pub fn http<A: ToSocketAddrs>(&self, addr: A) -> HttpResult<Listening> {
        let mut chain = Chain::new(handle);

        Iron::new(chain).http(addr)
    }
}

fn handle(_: &mut Request) -> IronResult<Response> {
    Ok(Response::with((Status::Ok, "Hello World")))
}

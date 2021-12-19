use actix_web::{web, App, HttpServer};
use ethers::providers::{Provider, Http};
use std::convert::TryFrom;

#[path = "routes/campaigns.rs"] mod campaigns;
#[path = "routes/privileged.rs"] mod privileged;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Postgres
    let postgres = 0;

    // Redis
    let client = redis::Client::open("redis://127.0.0.1/").unwrap();
    let con = client.get_async_connection().await;

    if con.is_err() {
        println!("An error occurred while connecting to redis.");
        std::process::exit(1);
    }

    // TODO: Fetch data and store in redis

    // Ethereum Provider
    let provider: Provider<Http> = Provider::<Http>::try_from("x").expect("could not instantiate HTTP Provider.");

    // Application scope definition
    HttpServer::new(move || App::new()
        .data(client.clone())
        .data(postgres.clone())
        .data(provider.clone())
        .service(web::scope("/campaigns")
            .service(campaigns::front_campaigns)
            .service(campaigns::explore_campaigns)
            .service(campaigns::get_campaign)
            .service(campaigns::submit_campaigns))
        .service(web::scope("/priv")
            .service(privileged::login)
            .service(privileged::list)
            .service(privileged::approve))
    ).bind("127.0.0.1:8080")?.run().await
}
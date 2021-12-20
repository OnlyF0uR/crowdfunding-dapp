use actix_web::{web, App, HttpServer};
use std::convert::TryFrom;

use deadpool_postgres::{Config, ManagerConfig, Pool, RecyclingMethod, Runtime};
use redis::Client;
use ethers::providers::{Provider, Http as EthHttp};

#[path = "routes/campaigns.rs"] mod campaigns;
#[path = "routes/privileged.rs"] mod privileged;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Postgres
    let mut cfg = Config::new();
    cfg.host = Some("localhost".to_string());
    cfg.dbname = Some("funding".to_string());
    cfg.user = Some("postgres".to_string());
    cfg.password = Some("x".to_string());
    cfg.manager = Some(ManagerConfig { recycling_method: RecyclingMethod::Fast });

    let pool = cfg.create_pool(Some(Runtime::Tokio1), tokio_postgres::NoTls).unwrap();

    // Redis
    let client = Client::open("redis://127.0.0.1/").unwrap();
    let con = client.get_async_connection().await;

    if con.is_err() {
        println!("An error occurred while connecting to redis.");
        std::process::exit(1);
    }

    // Ethereum Provider
    let provider: Provider<EthHttp> = Provider::<EthHttp>::try_from("x").expect("could not instantiate HTTP Provider.");

    // Application scope definition
    HttpServer::new(move || App::new()
        .app_data(web::Data::new(pool.clone()))
        .app_data(web::Data::new(client.clone()))
        .app_data(web::Data::new(provider.clone()))

        // .app_data(web::Data::new(web::Data::clone(&data)))
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
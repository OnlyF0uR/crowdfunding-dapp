use actix_web::{web, App, HttpServer};

#[path = "routes/campaigns.rs"] mod campaigns;
#[path = "routes/privileged.rs"] mod privileged;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let client = redis::Client::open("redis://127.0.0.1/").unwrap();
    let mut con = client.get_async_connection().await;

    if con.is_err() {
        println!("An error occurred while connecting to redis.");
        std::process::exit(1);
    }

    // TODO: Fetch from db and store in redis

    HttpServer::new(|| {
        App::new().service(
            web::scope("/api")
                .service(web::scope("/campaigns")
                    .service(campaigns::front_campaigns)
                    .service(campaigns::explore_campaigns)
                    .service(campaigns::get_campaign)
                )
                .service(web::scope("/priv")
                    .service(privileged::login)
                    .service(privileged::list)
                    .service(privileged::approve)
                )
        )
    }).bind("127.0.0.1:8080")?.run().await
}
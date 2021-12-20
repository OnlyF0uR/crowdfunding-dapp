use actix_web::{get, post, HttpResponse, Responder, HttpRequest };
use actix_web::web::{Data, Path};
use serde::{Serialize, Deserialize};

use deadpool_postgres::Pool;
use redis::Client;
use ethers::providers::{Provider, Http as EthHttp};

#[derive(Serialize, Deserialize)]
struct BriefCampaign {
    id: u32,
    address: String,
    title: String,
    image: String,
    short_desc: String,
    goal: u32
}

struct FullCampaign {
    id: u32,
    address: String,
    title: String,
    image: String,
    short_desc: String,
    long_desc: String,
    goal: u32,
    category: String,
    expires: u64,
    verified: bool
}

#[get("/front")]
pub async fn front_campaigns(req: HttpRequest, redis: Data<Client>) -> impl Responder {
    let data = BriefCampaign { id: 0, address: "".to_string(), title: "".to_string(), image: "".to_string(), short_desc: "".to_string(), goal: 10 };
    let serialized = serde_json::to_string(&data).unwrap();

    HttpResponse::Ok().body(serialized)
}

#[get("/explore/{page}")]
pub async fn explore_campaigns(req: HttpRequest, path: Path<(u32,)>, redis: Data<Client>) -> impl Responder {
    let info = path.into_inner();
    HttpResponse::Ok().body(format!("Todo (Page): {}", info.0))
}

#[get("/{id}")]
pub async fn get_campaign(req: HttpRequest, path: Path<(u32,)>, pool: Data<Pool>, redis: Data<Client>) -> impl Responder {
    let info = path.into_inner();
    HttpResponse::Ok().body(format!("Todo (ID): {}", info.0))
}

#[post("/submit")]
pub async fn submit_campaigns(req: HttpRequest, pool: Data<Pool>, prov: Data<Provider<EthHttp>>) -> impl Responder {
    HttpResponse::Ok().body("Todo (ID)")
}
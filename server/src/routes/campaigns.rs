use actix_web::{get, post, web, HttpResponse, Responder};
use ethers::providers::Http;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct BriefResponse {
    id: u32,
    address: String,
    title: String,
    image: String,
    short_desc: String,
    goal: u32
}

#[get("/front")]
pub async fn front_campaigns(redis: web::Data<redis::Client>) -> impl Responder {
    let data = BriefResponse { id: 0, address: "".to_string(), title: "".to_string(), image: "".to_string(), short_desc: "".to_string(), goal: 10 };
    let serialized = serde_json::to_string(&data).unwrap();

    HttpResponse::Ok().body(serialized)
}

#[get("/explore/{page}")]
pub async fn explore_campaigns(path: web::Path<(u32,)>) -> impl Responder {
    let info = path.into_inner();
    HttpResponse::Ok().body(format!("Todo (Page): {}", info.0))
}

#[get("/{id}")]
pub async fn get_campaign(path: web::Path<(u32,)>) -> impl Responder {
    let info = path.into_inner();
    HttpResponse::Ok().body(format!("Todo (ID): {}", info.0))
}

#[post("/submit")]
pub async fn submit_campaigns(prov: web::Data<ethers::providers::Provider<Http>>, req_body: String) -> impl Responder {
    HttpResponse::Ok().body("Todo (ID)")
}
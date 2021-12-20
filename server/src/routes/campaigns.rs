use std::env;
use std::fmt::Debug;
use actix_web::{get, post, HttpResponse, Responder, HttpRequest };
use actix_web::web::{Data, Path};
use serde::{Serialize, Deserialize};
use std::str::FromStr;

use deadpool_postgres::Pool;
use redis::Client;
use web3::contract::{Contract, Options};
use web3::types::{Address, U256};

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
pub async fn submit_campaigns(req: HttpRequest, pool: Data<Pool>, web3: Data<web3::Web3<web3::transports::Http>>) -> impl Responder {
    // println!("Calling accounts.");
    // let mut accounts = web3.eth().accounts().await.expect("Could not call accounts.");
    // println!("Accounts: {:?}", accounts);

    let fund_addr: Address = Address::from_str(&env::var("CTR_ADDRESS").unwrap()).unwrap();
    let fund_contract = Contract::from_json(web3.eth(), fund_addr, include_bytes!("../../../client/src/contracts/FundingABI.json")).unwrap();

    let c_addr: Address = fund_contract
        .query("campaigns", (1,), None, Options::default(), None)
        .await
        .expect("Failed calling function.");

    println!("{}", c_addr);

    HttpResponse::Ok().body("Todo (ID)")
}
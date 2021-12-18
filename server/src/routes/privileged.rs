use actix_web::{get, post, HttpResponse, Responder};

#[post("/login")]
pub async fn login() -> impl Responder {
    HttpResponse::Ok().body("todo")
}

#[get("/list")]
pub async fn list() -> impl Responder {
    HttpResponse::Ok().body("todo")
}

#[post("/approve")]
pub async fn approve() -> impl Responder {
    HttpResponse::Ok().body("todo")
}
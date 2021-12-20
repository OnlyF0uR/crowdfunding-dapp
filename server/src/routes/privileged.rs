use actix_web::{get, post, HttpResponse, Responder, HttpRequest};

#[post("/login")]
pub async fn login(req: HttpRequest) -> impl Responder {
    HttpResponse::Ok().body("todo")
}

#[get("/list")]
pub async fn list(req: HttpRequest) -> impl Responder {
    HttpResponse::Ok().body("todo")
}

#[post("/approve")]
pub async fn approve(req: HttpRequest) -> impl Responder {
    HttpResponse::Ok().body("todo")
}
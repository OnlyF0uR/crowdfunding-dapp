import React, { useState, useEffect } from 'react';
import { roundNumber } from '../utils';
import { Link } from 'react-router-dom';

import './Home.css';

import { Card, Row, Col, Carousel, ProgressBar, Nav, Container } from 'react-bootstrap';

function HomeContent() {
    return (
        <>
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1450387635522-8ecb968079bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2017&q=80"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1450387635522-8ecb968079bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2017&q=80"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1450387635522-8ecb968079bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2017&q=80"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </>
    );
};

// TODO: Fetch data and fetch from blockchain (Somehow out of sync? Don't display)
function HomeCampaigns(props) {
    const [campaign, setCampaign] = useState({ key: null, content: [] });

    useEffect(() => {
        const firstKey = Object.keys(props.campaigns)[0];
        const firstValue = props.campaigns[firstKey];

        setCampaign({ key: firstKey, content: firstValue });
    }, [props]);

    return (
        <div style={{ marginTop: '75px' }}>
            <h1>Explore Campaigns</h1>
            <Nav className="justify-content-center" onSelect={(key) => {
                setCampaign({ key: key, content: props.campaigns[key] });
            }}>
                <Nav.Item>
                    {/* So that hot is highlighted by default */}
                    <Nav.Link eventKey="hot" className={campaign.key === 'hot' ? "Nav-item active" : "Nav-item"}>Hot 🔥</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="charity" className="Nav-item">Charity</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="startup" className="Nav-item">Startup</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="launchpad" className="Nav-item">Launchpad 🚀</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="Campaigns">
                {campaign.content.length === 0 ? <><h5>No campaigns were found...</h5></> : <Row xs={1} md={4} className="g-5">
                    {campaign.content.map((data, idx) => (
                        <Col key={idx}>
                            <Link to={`/campaign/${data.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                                <Card className="Card">
                                    <Card.Img variant="top" src={data["image"]} />
                                    <Card.Body>
                                        <Card.Title className="Card-title">{data['title']}</Card.Title>
                                        <Card.Text className="Card-adr">{data['adr']}</Card.Text>
                                        <hr />
                                        <Card.Text className="Card-desc">{data['desc']}</Card.Text>

                                        <hr />
                                        <Card.Text className="Card-prog">{data['prog']['curr'] + ' ' + roundNumber(data['prog']['current'], 1000000) + '/' + roundNumber(data['prog']['goal'], 10)}</Card.Text>
                                        <ProgressBar animated className="Card-progbar" now={data['prog']['current'] / data['prog']['goal'] * 100} />
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>}
            </div>
        </div>
    );
};

function HomeFuture() {
    return (
        <>
            <hr style={{ marginTop: '75px' }} />
            <h1>What's next?</h1>
            <Container style={{ marginTop: '25px' }}>
                <Row>
                    <Col sm={6}>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mattis pulvinar odio, dapibus vestibulum mi. Nullam posuere convallis turpis eu finibus. Nulla metus erat, faucibus sit amet tempus quis, accumsan a augue. Quisque ullamcorper diam at quam bibendum, vel laoreet nulla sagittis. Nulla semper, metus a rutrum feugiat, enim felis rhoncus nulla, eu lobortis risus dui vel felis. Ut sagittis massa nec libero ornare ornare. Curabitur eu nulla tristique, bibendum enim posuere, cursus nulla. Fusce lorem dui, pretium id dolor aliquet, semper vestibulum diam. Nulla eu risus purus. Curabitur bibendum viverra maximus. Morbi convallis congue pharetra. Vivamus eget faucibus nisi, vel varius diam. Nullam ultricies ligula vitae faucibus hendrerit. Quisque lectus odio, sodales sed justo sit amet, vestibulum ornare quam.
                        </p>
                        <p>
                            Morbi eu tellus iaculis, pellentesque nulla rutrum, imperdiet sem. Vestibulum sit amet ante condimentum, ullamcorper quam at, rutrum nibh. Etiam convallis facilisis sagittis. Morbi varius, nulla at placerat congue, nunc elit porttitor libero, id commodo nibh risus eget felis. Etiam ut felis eu ligula gravida vulputate et a sapien. Morbi nec nisl vel massa varius fringilla quis quis eros. Aliquam viverra libero sed velit elementum placerat. Morbi pellentesque ligula non lacus imperdiet consequat. Cras eleifend enim ac nisl volutpat, vel sagittis turpis sollicitudin. Vestibulum est leo, pharetra id volutpat eu, malesuada ac nulla.
                        </p>
                        <p>
                            Sed lobortis condimentum mi sit amet elementum. Nulla sed eros eget ligula posuere gravida. Quisque fermentum scelerisque malesuada. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sit amet nunc eget justo volutpat condimentum sit amet et lectus. Aliquam erat volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec faucibus tellus at imperdiet faucibus. Nunc blandit nisi at diam gravida dignissim.
                        </p>
                    </Col>
                    <Col sm={4}><img alt="roadmap" src="https://images.unsplash.com/photo-1555367072-90923442306e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" /></Col>
                </Row>
            </Container>
        </>
    );
};

export {
    HomeContent, HomeCampaigns, HomeFuture
};
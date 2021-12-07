import React, { useState, useEffect } from 'react';
import { roundNumber } from '../utils';

import './Campaigns.css';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Nav from 'react-bootstrap/Nav';

function Campaign(props) {
    const [campaign, setCampaign] = useState({ key: null, content: [] });

    useEffect(() => {
        const firstKey = Object.keys(props.campaigns)[0];
        const firstValue = props.campaigns[firstKey];

        setCampaign({ key: firstKey, content: firstValue });
    }, [props]);

    return (
        <>
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
                <Row xs={1} md={4} className="g-5">
                    {campaign.content.map((data, idx) => (
                        <Col key={idx}>
                            <Card className="Card">
                                <Card.Img variant="top" src={data["image"]} />
                                <Card.Body>
                                    <Card.Title className="Card-title">{data['title']}</Card.Title>
                                    <Card.Text className="Card-adr">{data['adr']}</Card.Text>
                                    <hr />
                                    <Card.Text className="Card-desc">{data['desc']}</Card.Text>

                                    <hr />
                                    <Card.Text className="Card-prog">{data['progress']['currency'] + ' ' + roundNumber(data['progress']['current'], 1000000) + '/' + roundNumber(data['progress']['goal'], 10)}</Card.Text>
                                    <ProgressBar animated className="Card-progbar" now={data['progress']['current'] / data['progress']['goal'] * 100} />
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    )
};

export default Campaign;
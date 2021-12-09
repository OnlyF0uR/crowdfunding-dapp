import { Container, Row, Col } from 'react-bootstrap';

function Error({ image, children }) {
    return (
        <div style={{ marginTop: '75px' }}>
            <Container style={{ marginTop: '25px' }}>
                <Row>
                    <Col sm={4}>
                        <img alt="page-not-found" src={image} style={{
                            width: '250px'
                        }} />
                    </Col>
                    <Col sm={6} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                        {children}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Error;
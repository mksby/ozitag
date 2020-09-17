import React from 'react';
import {Card, Row, Col, Spinner} from 'react-bootstrap';

export const Component = ({ status, apartaments }) => {
    if (status === 'loading') {
        return (
            <Spinner animation="border" variant="primary" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    }

    if (status === 'succeed') {
        return (
            <Row>
                {apartaments.items.map(a => (
                    <Col md={4} sm={6} key={a.id}>
                        <Card>
                            <Card.Img variant="top" src={a.image} />
                            <Card.Body>
                                <Card.Title>{a.title} <small>{a.updatedAt}</small></Card.Title>
                                <Card.Text>{a.description}</Card.Text>
                                <Card.Text>{a.rooms}-ком. за {a.price} бел. руб. / сутки</Card.Text>
                                <Card.Footer>Контакт: {a.contact}</Card.Footer>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        )
    }

    return <div></div>;
};
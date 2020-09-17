import React from 'react';
import {Form, Row, Col, Button, InputGroup, Spinner} from 'react-bootstrap';

export const Component = ({
    price_min,
    price_to,
    price_from,
    price_max,
    rooms_total,
    rooms,
    onChangePriceFrom,
    onChangePriceTo,
    onChangeCountRooms,
    onSearch,
    loading,
    apartaments,
    status
}) => (
    <Form className="border p-3 mb-3">
        <Form.Group className="d-flex">
            <Form.Label className="mr-5 mb-0 text-nowrap d-flex align-items-center"><b>Count of rooms</b></Form.Label>
            <Form.Control as="select" value={rooms} onChange={onChangeCountRooms}>
                {Array.from({length: rooms_total}, (_, i) => i + 1).map(v => (
                    <option key={v}>{v}</option>
                ))}
            </Form.Control>
        </Form.Group>
        <div><b>Price</b></div>
        <Row>
            <Col>
                <Form.Group>
                    <Form.Label>From</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control value={price_from} disabled />
                        <InputGroup.Append>
                            <InputGroup.Text>бел. руб.</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                    <Form.Control value={price_from} onChange={onChangePriceFrom} min={price_min} max={price_max} type="range" />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group>
                    <Form.Label>To</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control value={price_to} disabled />
                        <InputGroup.Append>
                            <InputGroup.Text>бел. руб.</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                    <Form.Control value={price_to} onChange={onChangePriceTo} min={price_min} max={price_max} type="range" />
                </Form.Group>
            </Col>
        </Row>
        <div className="d-flex justify-content-between align-items-center text-right">
            <div>{status === 'succeed' && <span>Найдено: {apartaments.total} кв.</span>}</div>
            <Button onClick={onSearch} disabled={loading} variant="primary">
                {loading && <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="mr-2"
                />}

                <span>Search</span>
            </Button>
        </div>
    </Form>
);
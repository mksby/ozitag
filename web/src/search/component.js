import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {Form, Row, Col, Button, InputGroup, Spinner} from 'react-bootstrap';
import { getApartaments } from '../apartaments/actions';
import { priceFrom, priceTo, countRooms } from './actions';

export const Component = () => {
    const state = useSelector(({ search, apartaments }) => ({
        price_from: search.price_from,
        price_to: search.price_to,
        price_min: search.price_min,
        price_max: search.price_max,
        rooms_total: search.rooms_total,
        rooms: search.rooms,
        loading: search.loading,
        status: apartaments.status,
        apartaments: apartaments.apartaments
    }));

    const dispatch = useDispatch();

    return (
        <Form className="border p-3 mb-3">
            <Form.Group>
                <Row>
                    <Col md="6" className="d-flex align-items-center">
                        <Form.Label className="mr-5 mb-2 mb-md-0 text-nowrap d-flex align-items-center"><b>Count of rooms</b></Form.Label>
                    </Col>
                    <Col md="6">
                        <Form.Control as="select" value={state.rooms} onChange={({ target: {value}}) => dispatch(countRooms(value))}>
                            {Array.from({length: state.rooms_total}, (_, i) => i + 1).map(v => (
                                <option key={v}>{v}</option>
                            ))}
                        </Form.Control>
                    </Col>
                </Row>
            </Form.Group>
            <div><b>Price</b></div>
            <Row>
                <Col md="6">
                    <Form.Group>
                        <Form.Label>From</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control type="number" disabled value={state.price_from} />
                            <InputGroup.Append>
                                <InputGroup.Text>бел. руб.</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                        <Form.Control value={state.price_from} onChange={({ target: {value}}) => dispatch(priceFrom(value))} min={state.price_min} max={state.price_max} type="range" />
                    </Form.Group>
                </Col>
                <Col md="6">
                    <Form.Group>
                        <Form.Label>To</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control type="number" disabled value={state.price_to} />
                            <InputGroup.Append>
                                <InputGroup.Text>бел. руб.</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                        <Form.Control value={state.price_to} onChange={({ target: {value}}) => dispatch(priceTo(value))} min={state.price_min} max={state.price_max} type="range" />
                    </Form.Group>
                </Col>
            </Row>
            <div className="d-flex justify-content-between align-items-center text-right">
                <div>{state.status === 'succeed' && <span>Найдено: {state.apartaments.total} кв.</span>}</div>
                <Button onClick={() => dispatch(getApartaments())} disabled={state.loading} variant="primary">
                    {state.loading && <Spinner
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
    )
};
import React from 'react';
import {Pagination} from 'react-bootstrap';

export const Component = ({ status, apartaments, onChangePage }) => {
    return (
        status === 'succeed' && apartaments.pages > 1 &&
        <Pagination size="sm">{Array.from({length: apartaments.pages}).map((_, i) => (
            <Pagination.Item key={i} active={i + 1 === apartaments.page} onClick={() => onChangePage(i + 1)}>{i + 1}</Pagination.Item>
        ))}</Pagination>
    );
};
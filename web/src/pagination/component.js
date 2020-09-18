import React from 'react';
import {Pagination} from 'react-bootstrap';

function pages(c, m) {
    var current = c,
        last = m,
        delta = 3,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push(null);
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

export const Component = ({ status, apartaments, onChangePage }) => {
    return (
        status === 'succeed' && apartaments.pages > 1 && (
            <Pagination size="sm" className="d-flex justify-content-center">
                <Pagination.First onClick={() => onChangePage(1)} />
                <Pagination.Prev onClick={() => onChangePage((apartaments.page - 1) || 1)} />
                {pages(apartaments.page, apartaments.pages).map((step, i) => (
                    (step && <Pagination.Item key={i} active={step === apartaments.page} onClick={() => step !== apartaments.page && onChangePage(step)}>{step}</Pagination.Item>) ||
                    (!step && <Pagination.Ellipsis key={i} />)
                ))}
                <Pagination.Next onClick={() => onChangePage(Math.min(apartaments.page + 1, apartaments.pages))} />
                <Pagination.Last onClick={() => onChangePage(apartaments.pages)} />
            </Pagination>
        )
    );
};
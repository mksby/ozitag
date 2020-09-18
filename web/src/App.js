import React from 'react';
import { connect } from 'react-redux';
import {Container,} from 'react-bootstrap';
import {Component as Search} from './search/component';
import {Container as Apartaments} from './apartaments/container';
import {Container as Pagination} from './pagination/container';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App pt-5">
      <Container>
        <h1 className="mb-5">Realt.by apartaments</h1>
        <Search />
        <Pagination />
        <Apartaments />
        <div className="mt-3">
          <Pagination />
        </div>
      </Container>
    </div>
  );
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    handleIncrementClick: () => dispatch({ type: 'INCREMENT' })
  }
};

export default App = connect(mapStateToProps, mapDispatchToProps)(App);

import { connect } from 'react-redux';
import { Component } from './component';

const mapStateToProps = ({ apartaments }) => {
  return {
    status: apartaments.status,
    apartaments: apartaments.apartaments
  };
};

export const Container = connect(mapStateToProps)(Component);
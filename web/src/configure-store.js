import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk'
import { searchReducer as search } from './search/reducer';
import { searchReducer as apartaments } from './apartaments/reducer';
import {composeWithDevTools} from 'redux-devtools-extension'

const middleware = [thunk];

export const store = createStore(
    combineReducers({ search, apartaments }),
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
);
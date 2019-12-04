import {
    SET_ORDERS
} from '../types/types';

const initialState = {
    orders: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_ORDERS:
        return { ...state, orders: action.payload };
    default:
        return state;
    }
}

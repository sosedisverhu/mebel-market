import {
    SET_AUTHENTICATED
} from '../types/types';

const initialState = {
    admin: null,
    productsCategories: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_AUTHENTICATED:
        return { ...state, admin: action.payload };
    default:
        return state;
    }
}

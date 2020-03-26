import {
    SET_AUTHENTICATED
} from '../types/types';

const initialState = {
    authenticated: null
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_AUTHENTICATED:
        return { ...state, authenticated: action.payload };
    default:
        return state;
    }
}

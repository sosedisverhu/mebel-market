import {
    SET_PARTNERS
} from '../types/types';

const initialState = {
    partners: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_PARTNERS:
        return { ...state, partners: action.payload };
    default:
        return state;
    }
}

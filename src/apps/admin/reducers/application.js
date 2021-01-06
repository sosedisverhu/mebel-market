import {
    SET_AUTHENTICATED,
    SET_ADMINS
} from '../types/types';

const initialState = {
    admin: null,
    admins: []
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_AUTHENTICATED:
        return { ...state, admin: action.payload };
    case SET_ADMINS:
        return { ...state, admins: action.payload };
    default:
        return state;
    }
}

import { SET_ADMINS } from '../types/types';

const setAdmins = payload => ({
    type: SET_ADMINS,
    payload
});

export default setAdmins;

import setDomain from '../../actions/setDomain';

export default function getDomain (req) {
    return dispatch => {
        return Promise.resolve(dispatch(setDomain(`${req.protocol}://${req.headers.host}`)));
    };
}

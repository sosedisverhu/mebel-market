import Admin from '../model';

export default function getAnyAdmin () {
    return Admin.findOne();
}

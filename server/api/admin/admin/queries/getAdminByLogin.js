import Admin from '../model';

export default function getAdminByLogin (login) {
    return Admin.findOne({ login });
}

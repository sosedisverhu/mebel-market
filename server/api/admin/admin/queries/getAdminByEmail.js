import Admin from '../model';

export default function getAdminByEmail (email) {
    return Admin.findOne({ email });
}

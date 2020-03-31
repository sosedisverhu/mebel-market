import Admin from '../model';

export default function getAllAdmins () {
    return Admin.find({ isMain: undefined });
}

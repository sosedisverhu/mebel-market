import Admin from '../model';

export default function getAllAdmins (isMain) {
    return Admin.find({ isMain: undefined });
}

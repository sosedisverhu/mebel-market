import Admin from '../model';

export default function deleteAdminByIds (ids) {
    return Admin.deleteMany({ id: { $in: ids } });
}

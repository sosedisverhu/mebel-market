import Admin from '../model';

export default function editAdmin (admin) {
    return Admin.findOneAndUpdate({ id: admin.id }, admin, { new: true });
}

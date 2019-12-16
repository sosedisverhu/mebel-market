import Partner from '../model';

export default function nullifyCategories (ids) {
    return Partner.find({ id: { $in: ids } });
}

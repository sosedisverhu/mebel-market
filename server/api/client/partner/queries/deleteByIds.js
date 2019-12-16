import Partner from '../model';

export default function deleteByIds (ids) {
    return Partner.deleteMany({ id: { $in: ids } });
}

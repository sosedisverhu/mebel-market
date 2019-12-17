import Partner from '../model';

export default function editPartner (partnerItem) {
    return Partner.findOneAndUpdate({ id: partnerItem.id }, partnerItem, { new: true });
}

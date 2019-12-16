import Partner from '../model';

export default function getPartnerById (id) {
    return Partner.find({ id });
}

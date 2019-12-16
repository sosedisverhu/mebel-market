import Partner from '../model';

export default function getAllPartners () {
    return Partner.find({});
}

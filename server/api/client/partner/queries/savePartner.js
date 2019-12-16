import Partner from '../model';

export default function savePartner (partner) {
    return Partner.create(partner);
};

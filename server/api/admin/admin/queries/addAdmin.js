import Admin from '../model';

export default function addAdmin (credential) {
    return Admin.create(credential);
}

import Admin from '../model';

export default function changeCredentials (credentials) {
    return Admin.findOneAndUpdate({ id: credentials.id }, credentials, { new: true });
}

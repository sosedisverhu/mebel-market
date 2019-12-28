import UserProducts from '../model';

export default function getUserProducts (id) {
    return UserProducts.find({ id });
}

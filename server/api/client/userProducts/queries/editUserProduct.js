import UserProducts from '../model';

export default function editUserProduct (userProducts) {
    return UserProducts.findOneAndUpdate({ id: userProducts.id }, userProducts, { new: true });
}

import UserProducts from '../model';

export default function saveUserProduct (userProducts) {
    return UserProducts.create(userProducts);
}

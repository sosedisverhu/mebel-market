import Basket from '../model';

export default function saveBasket (basket) {
    return Basket.create(basket);
}

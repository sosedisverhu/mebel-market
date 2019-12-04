import Basket from '../model';

export default function getBasket (id) {
    return Basket.find({ id });
}

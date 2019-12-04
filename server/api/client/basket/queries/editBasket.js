import Basket from '../model';

export default function editBasket (basket) {
    return Basket.findOneAndUpdate({ id: basket.id }, basket, { new: true });
}

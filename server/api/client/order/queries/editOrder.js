import Order from '../model';

export default function editOrder (order) {
    return Order.findOneAndUpdate({ id: order.id }, order, { new: true });
}

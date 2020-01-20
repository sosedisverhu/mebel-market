import Order from '../model';

export default function getAllOrders () {
    return Order.find({});
}

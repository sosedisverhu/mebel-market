import order from '../model';

export default function saveOrder (orderInfo) {
    return order.create(orderInfo);
}

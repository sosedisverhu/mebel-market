import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Basket = new Schema({
    id: { type: String, required: true },
    basket: [{
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        properties: { type: Object, required: true },
        id: { type: String, required: true }
    }]
});

export default mongoose.model('Basket', Basket);

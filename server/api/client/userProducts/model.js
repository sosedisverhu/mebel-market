import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserProducts = new Schema({
    id: { type: String, required: true },
    basket: [{
        id: { type: String, required: true },
        quantity: { type: Number, required: true },
        properties: { type: Object, required: true },
        productId: { type: String, required: true }
    }],
    wishlist: [{
        id: { type: String, required: true },
        productId: { type: String, required: true },
        properties: { type: Object, required: true }
    }]
});

export default mongoose.model('UserProducts', UserProducts);

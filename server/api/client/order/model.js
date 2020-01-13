import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Order = new Schema({
    id: { type: String, required: true },
    shortId: { type: String, required: true },
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String },
        comment: { type: String }
    },
    delivery: { type: Object, required: true },
    payment: { type: Object, required: true },
    products: { type: Array, required: true },
    date: { type: Number, required: true },
    comment: { type: String, required: false },
    status: { type: String, required: true }
});

export default mongoose.model('Order', Order);

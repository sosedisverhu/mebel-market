import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Order = new Schema({
    id: { type: String, required: true },
    shortId: { type: String, required: true },
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        comment: { type: String }
    },
    orderType: { type: String, required: true },
    paymentType: { type: String, required: true },
    address: {
        region: { type: String },
        city: { type: String },
        department: { type: String }
    },
    products: { type: Array, required: true },
    date: { type: Number, required: true },
    comment: { type: String, required: false },
    status: { type: String, required: true }
});

export default mongoose.model('Order', Order);

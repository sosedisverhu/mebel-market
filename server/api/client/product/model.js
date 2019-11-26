import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema({
    id: { type: String, required: true },
    texts: { type: Object, required: true },
    avatar: { type: String },
    files: [{ type: String }],
    hidden: { type: Boolean },
    views: { type: Number, required: true },
    date: { type: Number },
    price: { type: Number, required: true },
    categoryId: { type: String, required: true }
});

export default mongoose.model('Product', Product);

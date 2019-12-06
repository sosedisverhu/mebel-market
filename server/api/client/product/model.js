import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema({
    id: { type: String, required: true },
    texts: { type: Object, required: true },
    avatar: { type: String },
    files: [{ type: String, required: true }],
    hidden: { type: Boolean, required: true },
    date: { type: Number, required: true },
    price: { type: Number, required: true },
    categoryId: { type: String, required: true },
    subCategoryId: { type: String, required: true },
    alias: { type: String, required: true, unique: true }
});

export default mongoose.model('Product', Product);

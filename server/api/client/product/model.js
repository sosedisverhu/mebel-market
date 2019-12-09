import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema({
    id: { type: String, required: true },
    texts: {
        type: {
            name: { type: String, required: true },
            description: { type: String, required: true },
            seoTitle: { type: String },
            seoDescription: { type: String },
            seoKeywords: { type: String }
        }
    },
    characteristics: { type: { characteristics: { type: Array, required: true } } },
    warranty: { type: Number, required: true },
    sizes: { type: Array, required: true },
    avatar: { type: String },
    files: [{ type: String, required: true }],
    hidden: { type: Boolean, required: true },
    date: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    categoryId: { type: String, required: true },
    subCategoryId: { type: String, required: true },
    alias: { type: String, required: true, unique: true }
});

export default mongoose.model('Product', Product);

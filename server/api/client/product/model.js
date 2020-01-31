import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema({
    id: { type: String, required: true },
    texts: {
        type: {
            name: { type: String, required: true },
            description: { type: String, required: true },
            shortDescription: { type: String, required: true },
            seoTitle: { type: String },
            seoDescription: { type: String },
            seoKeywords: { type: String }
        }
    },
    views: { type: Number, required: true },
    characteristics: { type: { characteristics: { type: Array, required: true } } },
    sizes: { type: Array, required: true },
    avatar: { type: String },
    files: [{ type: String, required: true }],
    hidden: { type: Boolean, required: true },
    date: { type: Number, required: true },
    minDiscount: { type: Number },
    warranty: { type: Number, required: true },
    minDiscountPrice: { type: Number },
    minPrice: { type: Number, required: true },
    actualPrice: { type: Number, required: true },
    categoryId: { type: String, required: true },
    subCategoryId: { type: String, required: true },
    alias: { type: String, required: true, unique: true },
    categoryFilters: [{
        id: { type: String, required: true },
        value: { type: String, required: true }
    }],
    subCategoryFilters: [{
        id: { type: String, required: true },
        value: { type: String, required: true }
    }]
});

export default mongoose.model('Product', Product);

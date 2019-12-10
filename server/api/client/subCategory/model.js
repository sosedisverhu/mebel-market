import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SumCategory = new Schema({
    id: { type: String, required: true },
    texts: {
        type: {
            name: { type: String, required: true },
            seoTitle: { type: String },
            seoDescription: { type: String },
            seoKeywords: { type: String }
        }
    },
    hidden: { type: Boolean, required: true },
    categoryId: { type: String, required: true },
    alias: { type: String, required: true, unique: true },
    positionIndex: { type: Number, required: true, unique: true }
});

export default mongoose.model('SumCategory', SumCategory);

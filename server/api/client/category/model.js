import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Category = new Schema({
    id: { type: String, required: true },
    texts: {
        type: {
            name: { type: String, required: true },
            seoTitle: { type: String },
            seoDescription: { type: String },
            seoKeywords: { type: String }
        }
    },
    alias: { type: String, required: true, unique: true },
    hidden: { type: Boolean, required: true },
    positionIndex: { type: Number, required: true }
});

export default mongoose.model('Category', Category);

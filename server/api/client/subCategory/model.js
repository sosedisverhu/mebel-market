import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SubCategory = new Schema({
    id: { type: String, required: true },
    texts: {
        type: {
            name: { type: String, required: true },
            sizeColumn: { type: String },
            descriptionColumn: { type: String },
            valueColumn: { type: String },
            seoTitle: { type: String },
            seoDescription: { type: String },
            seoKeywords: { type: String }
        }
    },
    hidden: { type: Boolean, required: true },
    categoryId: { type: String, required: true },
    alias: { type: String, required: true, unique: true },
    positionIndex: { type: Number, required: true, unique: true },
    filters: { type: Object, required: true },
    colorFilter: { type: Boolean, required: true, default: false },
    sizeFilter: { type: Boolean, required: true, default: false }
});

export default mongoose.model('SubCategory', SubCategory);

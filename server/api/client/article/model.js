import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Article = new Schema({
    id: { type: String, required: true },
    texts: {
        type: {
            name: { type: String, required: true },
            preview: { type: String, required: true },
            content: { type: String, required: true },
            seoTitle: { type: String },
            seoDescription: { type: String },
            seoKeywords: { type: String }
        }
    },
    hidden: { type: Boolean, required: true },
    date: { type: Number, required: true },
    alias: { type: String, required: true, unique: true }
});

export default mongoose.model('Article', Article);

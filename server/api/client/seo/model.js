import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Seo = new Schema({
    name: { type: String, required: true, unique: true },
    texts: {
        type: {
            seoTitle: { type: String, required: true },
            seoDescription: { type: String, required: true },
            seoKeywords: { type: String, required: true }
        },
        required: true
    }
});

export default mongoose.model('Seo', Seo);

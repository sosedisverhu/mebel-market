import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Article = new Schema({
    id: { type: String },
    texts: { type: Object },
    hidden: { type: Boolean },
    date: { type: Number },
    alias: { type: String }
});

export default mongoose.model('Article', Article);

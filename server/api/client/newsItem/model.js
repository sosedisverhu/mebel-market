import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NewsItem = new Schema({
    id: { type: String, required: true },
    texts: { type: Object, required: true },
    avatar: { type: String },
    files: [{ type: String, required: true }],
    youTubeVideo: { type: String },
    hidden: { type: Boolean, required: true },
    date: { type: Number, required: true },
    alias: { type: String, required: true }
});

export default mongoose.model('NewsItem', NewsItem);

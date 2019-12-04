import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Article = new Schema({
    // id: { type: String, required: true },
    // texts: { type: Object, required: true },
    // avatar: { type: String },
    // files: [{ type: String, required: true }],
    // youTubeVideo: { type: String },
    // hidden: { type: Boolean, required: true },
    // date: { type: Number, required: true },
    // alias: { type: String, required: true }

    id: { type: String },
    texts: { type: Object },
    hidden: { type: Boolean },
    date: { type: Number },
    alias: { type: String }
});

export default mongoose.model('Article', Article);

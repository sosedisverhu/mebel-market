import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Category = new Schema({
    id: { type: String, required: true },
    texts: { type: Object, required: true },
    alias: { type: String, required: true },
    hidden: { type: Boolean, required: true },
    positionIndex: { type: Number, required: true }
});

export default mongoose.model('Category', Category);

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Review = new Schema({
    id: { type: String, required: true },
    user: {
        name: { type: String, required: true },
        emailOrPhone: { type: String, required: true },
        comment: { type: String },
        mark: { type: Number, required: true }
    },
    date: { type: Number, required: true },
    checked: { type: Boolean, required: true }
});

export default mongoose.model('Review', Review);

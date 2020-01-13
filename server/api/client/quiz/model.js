import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Quiz = new Schema({
    id: { type: String, required: true },
    texts: { type: Object, required: true },
    hidden: { type: Boolean, required: true },
    steps: { type: Object, required: true },
    alias: { type: String, required: true, unique: true }
});

export default mongoose.model('Quiz', Quiz);

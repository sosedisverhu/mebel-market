import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Partner = new Schema({
    id: { type: String, required: true },
    texts: { type: Object, required: true },
    hidden: { type: Boolean, required: true },
    alias: { type: String, required: true, unique: true },
    logo: { type: String }
});

export default mongoose.model('Partner', Partner);

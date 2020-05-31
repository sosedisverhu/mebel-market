import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const mainSlider = new Schema({
    id: { type: String, required: true },
    slides_ru: [{
        path: { type: String, required: true },
        link: { type: String, required: true },
        name: { type: String },
        newTab: { type: Boolean, required: true }
    }],
    slides_ua: [{
        path: { type: String, required: true },
        link: { type: String, required: true },
        name: { type: String },
        newTab: { type: Boolean, required: true }
    }]
});

export default mongoose.model('mainSlider', mainSlider);

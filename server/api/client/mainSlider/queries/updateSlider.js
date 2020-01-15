import mainSlider from '../model';

export default function updateSlider (slider) {
    return mainSlider.findOneAndUpdate({ id: slider.id }, slider, { new: true });
}

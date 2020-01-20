import mainSlider from '../model';

export default function getSlider (id) {
    return mainSlider.find({ id });
}

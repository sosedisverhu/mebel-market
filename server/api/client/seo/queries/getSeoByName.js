import Seo from '../model';

export default function getSeoByName (name) {
    return Seo.find({ name });
}

import Seo from '../model';

export default function saveSeo (seo) {
    return Seo.create(seo);
}

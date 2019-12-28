import Seo from '../model';

export default function editProduct (seo) {
    return Seo.findOneAndUpdate({ name: seo.name }, seo, { new: true });
}

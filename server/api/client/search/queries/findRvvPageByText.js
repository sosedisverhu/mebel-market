import Rvv from '../../rvv/model';

export default function findNewsByText (text) {
    return Rvv.find({ '$or': [
        { 'rvv.plans.texts.ua.title': { $regex: text, $options: 'i' } },
        { 'rvv.plans.texts.en.title': { $regex: text, $options: 'i' } },
        { 'rvv.why.texts.ua.title': { $regex: text, $options: 'i' } },
        { 'rvv.why.texts.en.title': { $regex: text, $options: 'i' } },
        { 'rvv.pProject.texts.ua.title': { $regex: text, $options: 'i' } },
        { 'rvv.pProject.texts.en.title': { $regex: text, $options: 'i' } },
        { 'rvv.pProject.texts.ua.description': { $regex: text, $options: 'i' } },
        { 'rvv.pProject.texts.en.description': { $regex: text, $options: 'i' } },
        { 'rvv.mainForces.texts.ua.title': { $regex: text, $options: 'i' } },
        { 'rvv.mainForces.texts.en.title': { $regex: text, $options: 'i' } },
        { 'rvv.keyFacts.texts.ua.title': { $regex: text, $options: 'i' } },
        { 'rvv.keyFacts.texts.en.title': { $regex: text, $options: 'i' } },
        { 'rvv.keyFacts.texts.ua.description': { $regex: text, $options: 'i' } },
        { 'rvv.keyFacts.texts.en.description': { $regex: text, $options: 'i' } },
        { 'rvv.composition.texts.ua.title': { $regex: text, $options: 'i' } },
        { 'rvv.composition.texts.en.title': { $regex: text, $options: 'i' } },
        { 'rvv.message.texts.ua.title': { $regex: text, $options: 'i' } },
        { 'rvv.message.texts.en.title': { $regex: text, $options: 'i' } }
    ] });
}

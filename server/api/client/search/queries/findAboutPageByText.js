import News from '../../about/model';

export default function findNewsByText (text) {
    return News.find({ '$or': [
        { 'about.texts.ua.text': { $regex: text, $options: 'i' } },
        { 'about.texts.en.text': { $regex: text, $options: 'i' } }
    ] });
}

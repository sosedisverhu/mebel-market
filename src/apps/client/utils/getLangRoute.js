import { LANGS, DEFAULT_LANG, DEFAULT_LANG_ROUTE } from '../constants/constants';

const langRoutesArr = LANGS.map((lang, i) => {
    return {
        [lang]: !i ? DEFAULT_LANG_ROUTE : `/${lang}`
    };
});
const langRoutesMap = Object.assign({}, ...langRoutesArr);

export default function getLangRoute (lang = DEFAULT_LANG) {
    return langRoutesMap[lang];
};

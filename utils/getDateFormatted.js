export default function getDateFormatted (miliseconds, lang) {
    const date = new Date(miliseconds);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    lang = (lang === 'ua') ? 'uk' : lang;
    const dateFormatted = date.toLocaleString(lang, options).slice(0, -3);
    
    return dateFormatted;
}

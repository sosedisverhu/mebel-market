import { LANGS } from '../constants/constants';

const langs = LANGS
    .slice(1)
    .join('|');
const langsRegex = new RegExp(`^/(${langs})`);

export default function getLangRouteParts (route) {
    return {
        langRoute: (route.match(langsRegex, '') || [''])[0],
        routeWithoutLang: route.replace(langsRegex, '')
    };
}

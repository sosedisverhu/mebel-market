import { DEFAULT_LANG, DEFAULT_LANG_ROUTE, LANGS } from '../constants/constants';

import getLangRouteParts from './getLangRouteParts';
import compose from '@tinkoff/utils/function/compose';
import nth from '@tinkoff/utils/array/nth';
import find from '@tinkoff/utils/array/find';

const langRoutesMap = LANGS.map((lang, i) => {
    return !i ? [DEFAULT_LANG_ROUTE, DEFAULT_LANG] : [`/${lang}`, lang];
});

export default function getLangFromRoute (path) {
    const { langRoute } = getLangRouteParts(path);
    return compose(
        nth(1),
        find(langRouteArr => langRouteArr[0] === langRoute)
    )(langRoutesMap) || DEFAULT_LANG;
}

import setLang from '../../actions/setLang';
import { matchPath } from 'react-router';

import getLangRouteParts from '../../utils/getLangRouteParts';
import { LANGS, DEFAULT_LANG, DEFAULT_LANG_ROUTE } from '../../constants/constants';

import find from '@tinkoff/utils/array/find';
import nth from '@tinkoff/utils/array/nth';
import compose from '@tinkoff/utils/function/compose';

const langRoutesMap = LANGS.map((lang, i) => {
    return !i ? [DEFAULT_LANG_ROUTE, DEFAULT_LANG] : [`/${lang}`, lang];
});

export default function getLangFromRoute (req) {
    return dispatch => {
        const match = matchPath(req.path, { path: '/:lang(en)?' });

        if (!match) {
            return dispatch(setLang(DEFAULT_LANG));
        }

        const { langRoute } = getLangRouteParts(req.path);
        const lang = compose(
            nth(1),
            find(langRouteArr => langRouteArr[0] === langRoute)
        )(langRoutesMap) || DEFAULT_LANG;

        return dispatch(setLang(lang));
    };
}

import {
    SET_LANG,
    SET_LANG_MAP,
    SET_LANG_ROUTE,
    SET_MEDIA_INFO,
    SET_MAIN_SLIDES,
    SET_SEO,
    SET_DOMAIN
} from '../types/types';
import { DEFAULT_LANG, DEFAULT_LANG_ROUTE } from '../constants/constants';

const initialState = {
    mainSlides: [],
    media: {
        width: 0,
        height: 0
    },
    langMap: {},
    lang: DEFAULT_LANG,
    langRoute: DEFAULT_LANG_ROUTE
};

export default function (state = initialState, action) {
    switch (action.type) {
    case SET_MAIN_SLIDES:
        return { ...state, mainSlides: action.payload };
    case SET_MEDIA_INFO:
        return { ...state, media: action.payload };
    case SET_LANG:
        return { ...state, lang: action.payload };
    case SET_LANG_MAP:
        return { ...state, langMap: action.payload };
    case SET_LANG_ROUTE:
        return { ...state, langRoute: action.payload };
    case SET_SEO:
        return { ...state, staticSeo: action.payload };
    case SET_DOMAIN:
        return { ...state, domain: action.payload };
    default:
        return state;
    }
}

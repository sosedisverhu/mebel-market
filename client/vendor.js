import '../utils/polyfill';

import smoothscroll from 'smoothscroll-polyfill';

if (typeof window !== 'undefined') {
    smoothscroll.polyfill();
}

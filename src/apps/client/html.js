import { GOOGLE_MAPS_KEY } from './constants/constants';

export default function (html, helmet, preloadedState = {}) {
    return `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            <!-- Google Tag Manager -->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M59R9QX');</script>
            <!-- End Google Tag Manager -->
            <meta http-equiv="content-type" content="text/html; charset=utf-8">
            <meta http-equiv='x-ua-compatible' content='ie=edge'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            <link rel='stylesheet' type='text/css' href='/public/client.chunk.css'>
            <link rel='shortcut icon' href='/client/images/favicon.png' type='image/png'>
        </head>
        <body>
            <!-- Google Tag Manager (noscript) -->
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M59R9QX"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->
            <div id='app'>${html}</div>
            <script>
                // WARNING: See the following for security issues around embedding JSON in HTML:
                // http://redux.js.org/recipes/ServerRendering.html#security-considerations
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\\\\\\\\u003c')}
            </script>
            <script src="//www.instagram.com/embed.js" defer='defer'></script>
            <script defer
                 src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}">
            </script>
            <script src='/public/vendors-client.chunk.js' defer='defer'></script>
            <script src='/public/client.chunk.js' defer='defer'></script>
        </body>
    </html>`;
}

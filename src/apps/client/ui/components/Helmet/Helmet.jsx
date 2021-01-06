import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactHelmet from 'react-helmet';

import { connect } from 'react-redux';

import { matchPath, withRouter } from 'react-router-dom';

import find from '@tinkoff/utils/array/find';
import map from '@tinkoff/utils/array/map';

import { LANGS } from '../../../constants/constants';
import getLangRouteParts from '../../../utils/getLangRouteParts';

const langs = LANGS.slice(1).join('|');

const CATEGORY_PATH = `/:lang(${langs})?/:categoryAlias`;
const SUBCATEGORY_PATH = `/:lang(${langs})?/:categoryAlias/:subCategoryAlias`;
const PRODUCT_PATH = `/:lang(${langs})?/:categoryAlias/:subCategoryAlias/:alias`;
const ARTICLE_PATH = `/:lang(${langs})?/articles/:alias`;
const PROMOTION_PRODUCT_PATH = `/:lang(${langs})?/promotions/:alias`;

const STATIC_ROUTES = [
    { id: 'main', path: `/:lang(${langs})?/`, exact: true },
    { id: 'delivery-and-payment', path: `/:lang(${langs})?/delivery-and-payment`, exact: true },
    { id: 'partners', path: `/:lang(${langs})?/partners`, exact: true },
    { id: 'articles', path: `/:lang(${langs})?/articles`, exact: true },
    { id: 'contacts', path: `/:lang(${langs})?/contacts`, exact: true },
    { id: 'search', path: `/:lang(${langs})?/search`, exact: true },
    { id: 'promotions', path: `/:lang(${langs})?/promotions`, exact: true }
];

const NOT_FOUND_META = {
    seoTitle: '404',
    seoDescription: '404',
    seoKeywords: '404'
};
const DEFAULT_STATIC_META = {
    seoTitle: 'default SEO title',
    seoDescription: 'default SEO description',
    seoKeywords: 'default SEO keywords'
};

const mapStateToProps = ({ application, data }) => {
    return {
        lang: application.lang,
        staticSeo: application.staticSeo,
        langRoute: application.langRoute,
        categories: data.categories,
        subCategories: data.subCategories,
        products: data.products,
        articles: data.articles,
        domain: application.domain
    };
};

class Helmet extends Component {
    static propTypes = {
        location: PropTypes.object,
        categories: PropTypes.array,
        subCategories: PropTypes.array,
        products: PropTypes.array,
        articles: PropTypes.array,
        lang: PropTypes.string.isRequired,
        staticSeo: PropTypes.array,
        domain: PropTypes.string.isRequired
    };

    static defaultProps = {
        location: {},
        categories: [],
        subCategories: [],
        staticSeo: [],
        products: {},
        articles: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            meta: this.getMeta()
        };
    }

    getMeta = (props = this.props) => {
        const { location: { pathname }, categories, subCategories, products, staticSeo, lang, articles, domain } = props;

        const categoryPage = matchPath(pathname, { path: CATEGORY_PATH, exact: true });
        const subCategoryPage = matchPath(pathname, { path: SUBCATEGORY_PATH, exact: true });
        const productPage = matchPath(pathname, { path: PRODUCT_PATH, exact: true });
        const promotionProductPage = matchPath(pathname, { path: PROMOTION_PRODUCT_PATH, exact: true });
        const articlePage = matchPath(pathname, { path: ARTICLE_PATH, exact: true });
        const staticRouteMatch = find(route => matchPath(pathname, route), STATIC_ROUTES);
        const { routeWithoutLang } = getLangRouteParts(pathname);

        if (staticRouteMatch) {
            const staticSeoPage = find(page => page.name === staticRouteMatch.id, staticSeo);

            if (staticSeoPage) {
                return {
                    seoTitle: staticSeoPage.texts[lang].seoTitle,
                    seoDescription: staticSeoPage.texts[lang].seoDescription,
                    seoKeywords: staticSeoPage.texts[lang].seoKeywords,
                    canonical: `${domain}${pathname}`,
                    lang: lang === 'ua' ? 'uk' : lang,
                    langLinks: [
                        { lang: 'ru', link: `${domain}${routeWithoutLang}` },
                        { lang: 'uk', link: `${domain}/ua${routeWithoutLang}` }
                    ]
                };
            }

            return DEFAULT_STATIC_META;
        }

        if (categoryPage) {
            const category = find(category => category.alias === categoryPage.params.categoryAlias, categories);

            if (category) {
                return {
                    seoTitle: category.texts[lang].seoTitle,
                    seoDescription: category.texts[lang].seoDescription,
                    seoKeywords: category.texts[lang].seoKeywords,
                    canonical: `${domain}${pathname}`,
                    lang: lang === 'ua' ? 'uk' : lang,
                    langLinks: [
                        { lang: 'ru', link: `${domain}${routeWithoutLang}` },
                        { lang: 'uk', link: `${domain}/ua${routeWithoutLang}` }
                    ]
                };
            }
        }

        if (subCategoryPage) {
            const subCategory = find(subCategory => subCategory.alias === subCategoryPage.params.subCategoryAlias, subCategories);

            if (subCategory) {
                return {
                    seoTitle: subCategory.texts[lang].seoTitle,
                    seoDescription: subCategory.texts[lang].seoDescription,
                    seoKeywords: subCategory.texts[lang].seoKeywords,
                    canonical: `${domain}${pathname}`,
                    lang: lang === 'ua' ? 'uk' : lang,
                    langLinks: [
                        { lang: 'ru', link: `${domain}${routeWithoutLang}` },
                        { lang: 'uk', link: `${domain}/ua${routeWithoutLang}` }
                    ]
                };
            }
        }

        if (productPage) {
            const subCategory = find(subCategory => subCategory.alias === productPage.params.subCategoryAlias, subCategories);

            if (subCategory) {
                const product = find(product => product.subCategoryId === subCategory.id && product.alias === productPage.params.alias, products);

                if (product) {
                    return {
                        seoTitle: product.texts[lang].seoTitle,
                        seoDescription: product.texts[lang].seoDescription,
                        seoKeywords: product.texts[lang].seoKeywords,
                        canonical: `${domain}${pathname}`,
                        lang: lang === 'ua' ? 'uk' : lang,
                        langLinks: [
                            { lang: 'ru', link: `${domain}${routeWithoutLang}` },
                            { lang: 'uk', link: `${domain}/ua${routeWithoutLang}` }
                        ]
                    };
                }
            }
        }

        if (promotionProductPage) {
            const promotionProducts = products.filter(product => product.sizes[lang].some(size => size.colors.some(color => color.action)));
            const product = find(product => product.alias === promotionProductPage.params.alias, promotionProducts);

            if (product) {
                return {
                    seoTitle: product.texts[lang].seoTitle,
                    seoDescription: product.texts[lang].seoDescription,
                    seoKeywords: product.texts[lang].seoKeywords,
                    canonical: `${domain}${pathname}`,
                    lang: lang === 'ua' ? 'uk' : lang,
                    langLinks: [
                        { lang: 'ru', link: `${domain}${routeWithoutLang}` },
                        { lang: 'uk', link: `${domain}/ua${routeWithoutLang}` }
                    ]
                };
            }
        }

        if (articlePage) {
            const article = find(article => article.alias === articlePage.params.alias, articles);

            if (article) {
                return {
                    seoTitle: article.texts[lang].seoTitle,
                    seoDescription: article.texts[lang].seoDescription,
                    seoKeywords: article.texts[lang].seoKeywords,
                    canonical: `${domain}${pathname}`,
                    lang: lang === 'ua' ? 'uk' : lang,
                    langLinks: [
                        { lang: 'ru', link: `${domain}${routeWithoutLang}` },
                        { lang: 'uk', link: `${domain}/ua${routeWithoutLang}` }
                    ]
                };
            }
        }

        return NOT_FOUND_META;
    };

    componentWillReceiveProps (nextProps) {
        const { location: { pathname } } = nextProps;

        if (this.props.location.pathname !== pathname) {
            this.setState({
                meta: this.getMeta(nextProps)
            });
        }
    }

    render () {
        const { meta } = this.state;

        return <ReactHelmet>
            <html lang={meta.lang} />
            <title>{meta.seoTitle}</title>
            <meta name='description' content={meta.seoDescription} />
            <meta name='keywords' content={meta.seoKeywords} />
            <link rel='canonical' href={meta.canonical}/>
            {map((langLink, i) => <link key={i} rel='alternate' hreflang={langLink.lang} href={langLink.link}/>, meta.langLinks)}
        </ReactHelmet>;
    }
}

export default withRouter(connect(mapStateToProps)(Helmet));

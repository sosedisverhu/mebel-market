import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter, matchPath } from 'react-router-dom';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Breadcrumbs.css';

class Breadcrumbs extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        langRoute: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        category: PropTypes.object,
        subCategory: PropTypes.object,
        product: PropTypes.object,
        article: PropTypes.object,
        noCategoryPage: '',
        location: PropTypes.object.isRequired
    };

    static defaultProps = {
        category: {},
        subCategory: {},
        product: {},
        article: {},
        isPromotionsPage: false
    };

    render () {
        const { location: { pathname }, langMap, langRoute, category, subCategory, product, article, lang, noCategoryPage } = this.props;
        const text = propOr('breadcrumbs', {}, langMap);
        const firstLevelPath = `${langRoute}/:alias`;
        const firstLevelMatch = matchPath(pathname, { path: firstLevelPath });

        return (
            <div className={styles.breadcrumbsWrap}>
                <div className={styles.breadcrumbs}>
                    <Link className={styles.breadcrumb} to={langRoute}>
                        {text.main}
                    </Link>
                    {noCategoryPage &&
                    <Link className={styles.breadcrumb} to={`${langRoute}/${firstLevelMatch.params.alias}`}>
                        {noCategoryPage}
                    </Link>}
                    {category.texts &&
                    <Link className={styles.breadcrumb} to={`${langRoute}/${category.alias}`}>
                        {category.texts[lang].name}
                    </Link>}
                    {subCategory.texts &&
                    <Link className={styles.breadcrumb} to={`${langRoute}/${category.alias}/${subCategory.alias}`}>
                        {subCategory.texts[lang].name}
                    </Link>}
                    {product.texts &&
                    <Link className={styles.breadcrumb} to={`${langRoute}/${category.alias}/${subCategory.alias}/${product.alias}`}>
                        {product.texts[lang].name}
                    </Link>}
                    {article.texts &&
                    <Link className={styles.breadcrumb} to={`${langRoute}/${firstLevelMatch.params.alias}/${article.alias}`}>
                        {article.texts[lang].name}
                    </Link>}
                </div>
            </div>);
    }
}

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang,
        langMap: application.langMap,
        langRoute: application.langRoute
    };
};

export default withRouter(connect(mapStateToProps)(Breadcrumbs));

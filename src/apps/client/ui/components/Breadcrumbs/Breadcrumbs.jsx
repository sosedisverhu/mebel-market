import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
        noCategoryPage: ''
    };

    static defaultProps = {
        category: {},
        subCategory: {},
        product: {},
        article: {},
        isPromotionsPage: false
    };

    render () {
        const { langMap, langRoute, category, subCategory, product, article, lang, noCategoryPage } = this.props;
        const text = propOr('breadcrumbs', {}, langMap);

        return (
            <div className={styles.breadcrumbsWrap}>
                <div className={styles.breadcrumbs}>
                    <Link className={styles.breadcrumb} to={langRoute}>
                        {text.main}
                    </Link>
                    {noCategoryPage &&
                    <span className={styles.breadcrumb}>
                        {noCategoryPage}
                    </span>}
                    {category.texts &&
                        (subCategory.texts
                            ? <Link className={styles.breadcrumb} to={`${langRoute}/${category.alias}`}>
                                {category.texts[lang].name}
                            </Link>
                            : <span className={styles.breadcrumb}>
                                {category.texts[lang].name}
                            </span>)}
                    {subCategory.texts &&
                        (product.texts
                            ? <Link className={styles.breadcrumb} to={`${langRoute}/${category.alias}/${subCategory.alias}`}>
                                {subCategory.texts[lang].name}
                            </Link>
                            : <span className={styles.breadcrumb}>
                                {subCategory.texts[lang].name}
                            </span>)}
                    {product.texts &&
                    <span className={styles.breadcrumb}>
                        {product.texts[lang].name}
                    </span>}
                    {article.texts &&
                    <span className={styles.breadcrumb}>
                        {article.texts[lang].name}
                    </span>}
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

export default connect(mapStateToProps)(Breadcrumbs);

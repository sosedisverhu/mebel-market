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
        product: PropTypes.object,
        isPromotionsPage: PropTypes.bool
    };

    static defaultProps = {
        category: {},
        product: {},
        isPromotionsPage: false
    };

    render () {
        const { langMap, langRoute, category, product, lang, isPromotionsPage } = this.props;
        const text = propOr('breadcrumbs', {}, langMap);
        const headerText = propOr('header', {}, langMap);

        return (
            <div className={styles.breadcrumbs}>
                <Link className={styles.breadcrumb} to={langRoute}>
                    {text.main}
                </Link>
                {isPromotionsPage &&
                <Link className={styles.breadcrumb} to={`${langRoute}/promotions`}>
                    {headerText.promotions}
                </Link>}
                {category.texts &&
                <Link className={styles.breadcrumb} to={`${langRoute}/${category.alias}`}>
                    {category.texts[lang].name}
                </Link>}
                {product.texts &&
                <Link className={styles.breadcrumb} to={`${langRoute}/${category.alias}/${product.id}`}>
                    {product.texts[lang].name}
                </Link>}
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

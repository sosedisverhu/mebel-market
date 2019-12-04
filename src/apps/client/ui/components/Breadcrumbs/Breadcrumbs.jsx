import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Breadcrumbs.css';

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang,
        langMap: application.langMap,
        langRoute: application.langRoute
    };
};
class Breadcrumbs extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        langRoute: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        category: PropTypes.object,
        product: PropTypes.object
    };

    render () {
        const { langMap, langRoute, category, product, lang } = this.props;
        const text = propOr('breadcrumbs', {}, langMap);

        return (
            <div className={styles.breadcrumbsWrap}>
                <div className={styles.breadcrumbs}>
                    <Link className={styles.breadcrumb} to={langRoute}>{text.main}</Link>
                    {/* <Link className={styles.breadcrumb} to={`${langRoute}/${category.alias}`}>{category.texts[lang].name}</Link> */}
                    <Link className={styles.breadcrumb} to={langRoute}>Доставка и оплата</Link>
                    {product && <Link className={styles.breadcrumb} to={`${langRoute}/${category.alias}/${product.id}`}>{product.texts[lang].name}</Link>}
                </div>
            </div>);
    }
}

export default connect(mapStateToProps)(Breadcrumbs);

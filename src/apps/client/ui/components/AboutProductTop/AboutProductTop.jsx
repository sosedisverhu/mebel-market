import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import styles from './AboutProductTop.css';
import propOr from '@tinkoff/utils/object/propOr';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        lang: application.lang
    };
};

class AboutProductTop extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        product: PropTypes.object.isRequired,
        newClass: PropTypes.string
    };

    render () {
        const { newClass, langMap, lang, product } = this.props;
        const text = propOr('aboutProductTop', {}, langMap);

        return <div className={classNames(styles.root, { [styles[newClass]]: newClass })}>
            <h1 className={styles.name}>
                {product.texts[lang].name}
            </h1>
            <div className={styles.warrantyArticleWrap}>
                <div className={styles.warranty}>
                    {`${text.warranty} ${product.warranty[lang]} м.`}
                </div>
                <div className={styles.article}>
                    артикул 48092
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(AboutProductTop);

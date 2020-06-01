import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';
import propOr from '@tinkoff/utils/object/propOr';

import formatWordDeclension from '../../../utils/formatWordDeclension';
import styles from './AboutProductTop.css';

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
        article: PropTypes.string.isRequired,
        newClass: PropTypes.string,
        isExist: PropTypes.string
    };

    render () {
        const { newClass, langMap, lang, product, article } = this.props;
        const text = propOr('aboutProductTop', {}, langMap);
        const isExist = propOr('exist', 'true', product);

        return <div className={classNames(styles.root, { [styles[newClass]]: newClass })}>
            <h1 className={styles.name}>
                {product.texts[lang].name}
            </h1>
            <div className={styles.warrantyArticleWrap}>
                <div className={styles.warranty}>
                    {`${text.warranty} ${product.warranty} ${formatWordDeclension(text.months, product.warranty)}`}
                </div>
                <div className={classNames(styles.existText, { [styles.notExist]: isExist === 'false' })}>
                    {isExist === 'true' ? langMap.exist.inStock : langMap.exist.order}
                </div>
                {!!article && <div className={styles.article}>{`${text.article} ${article}`}</div>}
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(AboutProductTop);

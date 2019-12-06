import React, { Component } from 'react';
import { connect } from 'react-redux';
import propOr from '@tinkoff/utils/object/propOr';
import PropTypes from 'prop-types';

import styles from './AboutProduct.css';

import formatMoney from '../../../utils/formatMoney';
import AboutProductTop from '../AboutProductTop/AboutProductTop';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class AboutProduct extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        product: PropTypes.object.isRequired
    };

    render () {
        const { product, langMap } = this.props;
        const text = propOr('product', {}, langMap);

        return <div className={styles.root}>
            <AboutProductTop product={product} />
            <div className={styles.advantagesTitle}>{text.advantages}</div>
            <ul className={styles.advantages}>
                <li className={styles.advantage}>просторность</li>
                <li className={styles.advantage}>универсальность</li>
                <li className={styles.advantage}>функциональность</li>
                <li className={styles.advantage}>простой и стильный дизайн</li>
                <li className={styles.advantage}>высокое ложе</li>
                <li className={styles.advantage}>удобное основание</li>
                <li className={styles.advantage}>простота в уходе</li>
            </ul>
            <div className={styles.details}>{text.datails}</div>
            <div className={styles.priceOld}>{formatMoney(2798)}</div>
            <div className={styles.price}>{formatMoney(1399)}</div>
            <div className={styles.sizes}>
                <div className={styles.sizesTitle}>Выберите размер:</div>
                <div className={styles.select}>
                    <div className={styles.activeOption}>190 см * 200 см</div>
                </div>
            </div>
            <div className={styles.buttons}>
                <button className={styles.btnBuy}>{text.buy}</button>
                <button className={styles.btnWishList}></button>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(AboutProduct);

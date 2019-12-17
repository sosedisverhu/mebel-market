import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import formatMoney from '../../../utils/formatMoney';

import AboutProductTop from '../AboutProductTop/AboutProductTop';
import styles from './AboutProduct.css';

class AboutProduct extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        product: PropTypes.object.isRequired
    };

    state = {
        sizes: [],
        activeSize: {},
        sizeListIsOpen: true
    };

    componentDidMount () {
        const { product } = this.props;

        this.setState({
            sizes: product.sizes,
            activeSize: product.sizes[0]
        });
    }

    onChangeActiveSize = size => {
        this.setState({
            activeSize: size,
            sizeListIsOpen: false
        });
    };

    sizeListIsOpen = () => {
        this.setState({
            sizeListIsOpen: true
        });
    };

    render () {
        const { product, langMap } = this.props;
        const { sizes, activeSize, sizeListIsOpen } = this.state;
        const text = propOr('product', {}, langMap);
        let sizeCounter = 0;

        return <div className={styles.root}>
            <AboutProductTop product={product}/>
            <div className={styles.advantagesTitle}>{text.advantages}</div>
            <ul>
                <li className={styles.advantage}>просторность</li>
                <li className={styles.advantage}>универсальность</li>
                <li className={styles.advantage}>функциональность</li>
                <li className={styles.advantage}>простой и стильный дизайн</li>
                <li className={styles.advantage}>высокое ложе</li>
                <li className={styles.advantage}>удобное основание</li>
                <li className={styles.advantage}>простота в уходе</li>
            </ul>
            <span className={styles.details}>{text.datails}</span>
            {product.discountPrice !== product.price &&
            <span className={styles.priceOld}>
                {formatMoney(product.price)}
            </span>}
            <span className={styles.price}>
                {formatMoney(product.discountPrice || product.discountPrice)}
            </span>
            <div>
                <span className={styles.sizesTitle}>{text.size}</span>
                <ul className={styles.select}
                    onMouseEnter={() => this.sizeListIsOpen()}
                >
                    <li className={styles.activeOption}>{activeSize.name}</li>
                    {sizes.map(size => {
                        if (size.id !== activeSize.id && sizeListIsOpen) {
                            sizeCounter++;
                            return <li className={styles.option}
                                onClick={() => this.onChangeActiveSize(size)}
                                style={{ top: `${30 * sizeCounter}px` }}
                                key={size.id}>
                                {size.name}
                            </li>;
                        }
                    })}
                </ul>
            </div>
            <div className={styles.buttons}>
                <button className={styles.btnBuy}>{text.buy}</button>
                <button className={styles.btnWishList}/>
            </div>
        </div>;
    }
}

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

export default connect(mapStateToProps)(AboutProduct);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import propOr from '@tinkoff/utils/object/propOr';
import setScrollToCharacteristic from '../../../actions/setScrollToCharacteristic';
import outsideClick from '../../hocs/outsideClick';

import styles from './AboutProduct.css';

import formatMoney from '../../../utils/formatMoney';
import AboutProductTop from '../AboutProductTop/AboutProductTop';

import saveProductsToWishlist from '../../../services/client/saveProductsToWishlist';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';

import classNames from 'classnames';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        wishlist: data.wishlist,
        basket: data.basket
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setScrollToCharacteristic: payload => dispatch(setScrollToCharacteristic(payload)),
        saveProductsToWishlist: payload => dispatch(saveProductsToWishlist(payload)),
        saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload))
    };
};

@outsideClick
class AboutProduct extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        product: PropTypes.object.isRequired,
        setScrollToCharacteristic: PropTypes.func.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        wishlist: PropTypes.array,
        saveProductsToWishlist: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired,
        quantity: PropTypes.number.isRequired
    };

    state = {
        sizes: [],
        activeSize: {},
        sizeListIsOpen: true,
        isInWishlist: false,
        selectIsOpen: false
    };

    componentDidMount () {
        const { product } = this.props;

        this.setState({
            sizes: product.sizes,
            activeSize: product.sizes[0]
        });
    }

    static getDerivedStateFromProps (props) {
        const { wishlist, product } = props;

        return (wishlist.find(item => item.product.id === product.id))
            ? { isInWishlist: true }
            : { isInWishlist: false };
    }

    scrollToTitles = () => {
        this.props.setScrollToCharacteristic(true);
    };

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

    selectIsOpen = () => {
        this.setState(state => ({
            selectIsOpen: !state.selectIsOpen
        }));
    };

    handleAddToWishlist = () => {
        const { saveProductsToWishlist, product } = this.props;
        saveProductsToWishlist({
            productId: product.id
        });

        this.setState({ isInWishlist: true });
    }

    handleBuyClick = () => {
        const { saveProductsToBasket, product, quantity } = this.props;
        saveProductsToBasket({
            productId: product.id,
            quantity
        });
    }

    render () {
        const { product, langMap } = this.props;
        const { sizes, activeSize, sizeListIsOpen, selectIsOpen, isInWishlist } = this.state;
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
            <div className={styles.details} onClick={this.scrollToTitles}>{text.details}</div>
            {product.discountPrice !== product.price &&
            <span className={styles.priceOld}>
                {formatMoney(product.price)}
            </span>}
            <span className={styles.price}>
                {formatMoney(product.actualPrice)}
            </span>
            <div>
                <span className={styles.sizesTitle}>{text.size}</span>
                <ul className={classNames(styles.select, { [styles.active]: selectIsOpen })}
                    onMouseEnter={() => this.sizeListIsOpen()}
                    onClick={this.selectIsOpen}
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
                <button className={styles.btnBuy} onClick={this.handleBuyClick}>{text.buy}</button>
                <button className={classNames(styles.btnWishList, { [styles.active]: isInWishlist })} onClick={this.handleAddToWishlist}/>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutProduct);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick.jsx';
import propOr from '@tinkoff/utils/object/propOr';
import findIndex from '@tinkoff/utils/array/findIndex';
import includes from '@tinkoff/utils/array/includes';

import styles from './WishList.css';

import deleteFromWishlist from '../../../services/client/deleteFromWishlist';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        wishlist: data.wishlist
    };
};

const mapDispatchToProps = (dispatch) => ({
    deleteFromWishlist: payload => dispatch(deleteFromWishlist(payload)),
    saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload))
});

const EXCEPTION_NUMBERS_MIN = 11;
const EXCEPTION_NUMBERS_MAX = 14;
const CASES_GROUPS = [[0, 5, 6, 7, 8, 9, 10, 11, 12], [1], [2, 3, 4]];

@outsideClick
class WishList extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        wishlist: PropTypes.array.isRequired,
        deleteFromWishlist: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired
    };

    state = {
        active: false
    };

    handlePopupClose = () => {
        document.body.style.overflowY = 'visible';
        this.setState({
            active: false
        });
    };

    handleClick = () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;

        document.body.style.overflowY = (!active) ? 'hidden' : 'visible';
        this.setState(state => ({ active: !state.active }));

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handlePopupClose);
        }
    };

    getWordCaseByNumber (number, cases) {
        if (number >= EXCEPTION_NUMBERS_MIN && number <= EXCEPTION_NUMBERS_MAX) {
            return cases[0];
        }

        const lastNumber = number % 10;
        const resultIndex = findIndex((group) => includes(lastNumber, group), CASES_GROUPS);

        return cases[resultIndex];
    }

    removeProduct = wishlistItemId => () => {
        this.props.deleteFromWishlist(wishlistItemId);
    };

    handleAddToBasket = product => () => {
        this.props.saveProductsToBasket({
            productId: product.id
        });
    };

    render () {
        const { langMap, lang, wishlist } = this.props;
        const { active } = this.state;
        const text = propOr('wishList', {}, langMap);

        return (
            <div className={styles.wishList}>
                <div className={styles.wishListWrapper} onClick={this.handleClick}>
                    <span className={styles.quantityAll}>{wishlist.length}</span>
                </div>
                <div className={classNames(styles.popupContainer, { [styles.active]: active })}>
                    <div className={styles.cover} onClick={this.handleClick}/>
                    <div className={styles.popup}>
                        <p className={styles.title}>
                            {text.title} {wishlist.length > 0 &&
                                <span>
                                    {wishlist.length}&nbsp;
                                    {this.getWordCaseByNumber(wishlist.length,
                                        lang === 'ru' ? ['товаров', 'товар', 'товара'] : ['товарів', 'товар', 'товари'])}
                                </span>
                            }
                        </p>
                        {wishlist.length > 0
                            ? <div className={styles.productsContainer}>
                                {wishlist.map(({ product, id: wishlistItemId }, i) =>
                                    <div className={styles.wishItemWrapper} key={i}>
                                        <div className={styles.wishItem}>
                                            <img className={styles.productImg} src={product.avatar} alt=""/>
                                            <div className={styles.productInfo}>
                                                <div>
                                                    <p className={styles.productName}>{product.texts[lang].name.split('« ').join('«').split(' »').join('»')}</p>
                                                    <p className={styles.productNumber}>Артикул: 48092</p>
                                                    <p className={styles.productSize}>{text.size} 190 х 200</p>
                                                    <div className={styles.productPrices}>
                                                        <p className={styles.productOldPrice}>{product.price}&#8372;</p>
                                                        <p className={styles.productPrice}>{product.discountPrice}&#8372;</p>
                                                    </div>
                                                </div>
                                                <div className={styles.productButtons}>
                                                    <button className={styles.removeBtn} onClick={this.removeProduct(wishlistItemId)}>
                                                        <img
                                                            className={styles.removeBtnImg} src="/src/apps/client/ui/components/Header/img/remove.png"
                                                            alt="remove"
                                                        />
                                                    </button>
                                                    <button className={styles.cartBtn} onClick={this.handleAddToBasket(product)}>{text.cartBtn}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}
                            </div>
                            : <p>{text.noProduct}</p>
                        }
                        <button className={styles.continueShopping} onClick={this.handlePopupClose}>{text.continueShopping}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WishList);

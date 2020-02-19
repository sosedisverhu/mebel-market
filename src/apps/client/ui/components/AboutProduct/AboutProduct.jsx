import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';
import setScrollToCharacteristic from '../../../actions/setScrollToCharacteristic';
import outsideClick from '../../hocs/outsideClick';
import formatMoney from '../../../utils/formatMoney';

import saveProductsToWishlist from '../../../services/client/saveProductsToWishlist';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';
import deleteFromWishlist from '../../../services/client/deleteFromWishlist';

import classNames from 'classnames';

import openBasket from '../../../actions/openBasket';

import AboutProductTop from '../AboutProductTop/AboutProductTop';
import styles from './AboutProduct.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        wishlist: data.wishlist,
        basket: data.basket,
        basketIsOpen: data.basketIsOpen
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setScrollToCharacteristic: payload => dispatch(setScrollToCharacteristic(payload)),
        saveProductsToWishlist: payload => dispatch(saveProductsToWishlist(payload)),
        saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload)),
        deleteFromWishlist: payload => dispatch(deleteFromWishlist(payload)),
        openBasket: (payload) => dispatch(openBasket(payload))
    };
};

@outsideClick
class AboutProduct extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        product: PropTypes.object.isRequired,
        setScrollToCharacteristic: PropTypes.func.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        wishlist: PropTypes.array,
        saveProductsToWishlist: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired,
        deleteFromWishlist: PropTypes.func.isRequired,
        basket: PropTypes.array,
        openBasket: PropTypes.func.isRequired,
        basketIsOpen: PropTypes.bool.isRequired,
        changeColor: PropTypes.func.isRequired,
        changeSize: PropTypes.func.isRequired,
        activeSize: PropTypes.object.isRequired,
        activeColor: PropTypes.object.isRequired
    };

    state = {
        sizes: this.props.product.sizes,
        sizeListIsOpen: true,
        selectIsOpen: false,
        isInWishlist: false,
        isInBasket: false,
        colorListOpen: false,
        checkedFeatureIds: {}
    };

    componentDidMount () {
        const { wishlist, product, activeColor } = this.props;

        this.setState({
            isInWishlist: !!(wishlist.find(item => item.product.id === product.id) && !!wishlist.find(item => item.properties.size.color.id === activeColor.id))
        });
    }

    static getDerivedStateFromProps (props, state) {
        const { basket, wishlist, product } = props;
        let values = {};

        values.isInBasket = !!(basket.find(item => item.product.id === product.id) &&
            basket.find(item => item.properties.size.color.id === props.activeColor.id));
        values.isInWishlist = !!wishlist.find(item => item.product.id === product.id && item.properties.size.color.id === props.activeColor.id);

        return values;
    }

    scrollToTitles = () => {
        this.props.setScrollToCharacteristic(true);
    };

    onChangeActiveSize = size => {
        this.setState({
            sizeListIsOpen: false
        });
        // this.props.changeGalleryDiscount(size);
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
        const { saveProductsToWishlist, deleteFromWishlist, wishlist, product, activeSize, activeColor } = this.props;
        const { isInWishlist } = this.state;

        if (!isInWishlist) {
            saveProductsToWishlist({
                productId: product.id,
                properties: {
                    size: {
                        id: activeSize.id,
                        color: {
                            id: activeColor.id
                        }
                    }
                }
            });
        } else {
            const wishlistItem = wishlist.find(el => el.product.id === product.id && el.properties.size.color.id === activeColor.id);
            if (wishlistItem) {
                deleteFromWishlist(wishlistItem.id);
            }
        }
    };

    handleBuyClick = () => {
        const { saveProductsToBasket, product, activeSize, activeColor } = this.props;
        const { checkedFeatureIds } = this.state;
        saveProductsToBasket({
            productId: product.id,
            properties: {
                size: {
                    id: activeSize.id,
                    color: {
                        id: activeColor.id
                    }
                },
                features: checkedFeatureIds
            },
            quantity: 1
        });
    };

    handleOpenBasket = () => {
        const { basketIsOpen, openBasket } = this.props;

        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        document.body.style.overflowY = (!basketIsOpen) ? 'hidden' : 'visible';
        openBasket();
    };

    convertNewLinesToBr = str => {
        return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    };

    changeColorListStatus = () => this.setState((state) => ({ colorListOpen: !state.colorListOpen }));

    handleChangeColor = (color) => {
        this.changeColorListStatus();
        this.props.changeColor(color);
    }

    handleCheckboxChange = (event) => {
        const { checkedFeatureIds } = this.state;
        const value = event.target.checked;
        const name = event.target.name;

        this.setState({
            checkedFeatureIds: {
                ...checkedFeatureIds,
                [name]: value
            }
        });
    }

    handleChangeSize = (size) => {
        this.setState({ checkedFeatureIds: {} });
        this.props.changeSize(size);
    }

    render () {
        const { product, langMap, lang, activeSize, activeColor } = this.props;
        const { sizes, sizeListIsOpen, selectIsOpen, isInWishlist, isInBasket, colorListOpen, checkedFeatureIds } = this.state;
        const text = propOr('product', {}, langMap);
        const isDiscount = !!activeColor.discountPrice;
        const shortDescription = product.texts[lang].shortDescription;
        const isOneSize = sizes.length === 1;
        let sizeCounter = 0;
        const features = activeSize.features || [];
        const checkedFeatures = features.filter(feature => checkedFeatureIds[feature.id]);
        const featuresPrice = checkedFeatures.reduce((sum, { value }) => sum + value, 0);
        const resultPrice = (activeColor.discountPrice || activeColor.price) + featuresPrice;

        return <div className={styles.root}>
            <AboutProductTop article={activeColor.article} product={product}/>
            {shortDescription &&
            <p className={styles.advantage} dangerouslySetInnerHTML = {{ __html: this.convertNewLinesToBr(shortDescription) }}/>}
            <div className={styles.details} onClick={this.scrollToTitles}>{text.details}</div>
            {isDiscount &&
            <span className={styles.priceOld}>
                {formatMoney(activeColor.price)}
            </span>}
            <span className={classNames(styles.price, styles.discountPrice)}>
                {formatMoney(resultPrice)}
            </span>
            <div className={styles.properties}>
                <div className={styles.sizesWrap}>
                    <span className={styles.sizesTitle}>
                        {!isOneSize ? text.size : text.oneSize}
                    </span>
                    <ul className={classNames(styles.select, { [styles.active]: selectIsOpen })}
                        onMouseEnter={() => this.sizeListIsOpen()}
                        onClick={this.selectIsOpen}
                    >
                        <li className={classNames(styles.activeOption, { [styles.oneActiveOption]: isOneSize })}>
                            {activeSize.name}
                        </li>
                        {sizes[lang].map(size => {
                            if (size.id !== activeSize.id && sizeListIsOpen) {
                                sizeCounter++;
                                return <li className={styles.option}
                                    onClick={() => this.handleChangeSize(size)}
                                    style={{ top: `${30 * sizeCounter}px` }}
                                    key={size.id}>
                                    {size.name}
                                </li>;
                            }
                        })}
                    </ul>
                </div>
                <div className={classNames(styles.colorWrap, { [styles.active]: colorListOpen })}>
                    <div className={styles.colorTitle}>
                        {text.chooseColor}
                    </div>
                    <div className={classNames(styles.color, styles.activeColor)}>
                        {<img className={styles.colorImg} onClick={this.changeColorListStatus} src={activeColor.file} alt={activeColor.name}/>}
                    </div>
                    <ul className={styles.colorList}>
                        {activeSize.colors.filter(color => color.id !== activeColor.id).map(color =>
                            <li className={styles.color}
                                onClick={() => this.handleChangeColor(color)}
                                key={color.id}>
                                <img className={styles.colorImg} src={color.file} alt={color.name}/>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className={styles.features}>
                {features && features.map(feature => {
                    return <label className={styles.feature}>
                        <input type="checkbox" checked={checkedFeatureIds[feature.id]} className={styles.featureInput}
                            onChange={this.handleCheckboxChange} name={feature.id}/>
                        <span className={styles.featureCheckmark}></span>
                        {feature.name} (<span className={styles.featureValue}>{` + ${formatMoney(feature.value)} `}</span>)
                    </label>;
                })}
            </div>
            <div className={styles.buttons}>
                <button
                    className={classNames(styles.btnBuy, { [styles.active]: isInBasket })}
                    onClick={!isInBasket ? this.handleBuyClick : this.handleOpenBasket}>
                    {!isInBasket
                        ? text.buy
                        : text.inBasket
                    }
                </button>
                <button className={classNames(styles.btnWishList, { [styles.active]: isInWishlist })}
                    onClick={this.handleAddToWishlist}/>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutProduct);

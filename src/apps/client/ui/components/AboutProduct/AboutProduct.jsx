import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';

import setScrollToCharacteristic from '../../../actions/setScrollToCharacteristic';

import formatMoney from '../../../utils/formatMoney';

import saveProductsToWishlist from '../../../services/client/saveProductsToWishlist';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';
import deleteFromWishlist from '../../../services/client/deleteFromWishlist';

import classNames from 'classnames';

import openBasket from '../../../actions/openBasket';

import AboutProductTop from '../AboutProductTop/AboutProductTop';
import PopupColor from '../PopupColor/PopupColor';
import PopupSizes from '../PopupSizes/PopupSizes';
import PopupPresents from '../PopupPresents/PopupPresents';
import styles from './AboutProduct.css';
import SizesSelect from '../SizesSelect/SizesSelect';
import ColorsSelect from '../ColorsSelect/ColorsSelect';
import outsideClick from '../../hocs/outsideClick';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        langRoute: application.langRoute,
        lang: application.lang,
        wishlist: data.wishlist,
        basket: data.basket,
        products: data.products,
        categories: data.categories,
        subCategories: data.subCategories,
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
        langRoute: PropTypes.string.isRequired,
        product: PropTypes.object.isRequired,
        setScrollToCharacteristic: PropTypes.func.isRequired,
        wishlist: PropTypes.array,
        products: PropTypes.array.isRequired,
        categories: PropTypes.array.isRequired,
        subCategories: PropTypes.array.isRequired,
        subCategory: PropTypes.object.isRequired,
        saveProductsToWishlist: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired,
        deleteFromWishlist: PropTypes.func.isRequired,
        basket: PropTypes.array,
        openBasket: PropTypes.func.isRequired,
        basketIsOpen: PropTypes.bool.isRequired,
        changeColor: PropTypes.func.isRequired,
        changeSize: PropTypes.func.isRequired,
        activeSize: PropTypes.object.isRequired,
        activeColor: PropTypes.object.isRequired,
        isPromotion: PropTypes.bool,
        turnOnClickOutside: PropTypes.func,
        outsideClickEnabled: PropTypes.bool,
        productAnimation: PropTypes.bool.isRequired
    };

    constructor (props) {
        super(props);

        this.shareInfo = React.createRef();

        this.state = {
            sizes: this.props.product.sizes,
            sizeListIsOpen: true,
            selectIsOpen: false,
            isInWishlist: false,
            isInBasket: false,
            colorListOpen: false,
            checkedFeatureIds: {},
            activePopupColorIndex: null,
            isPopupSizes: false,
            isPopupPresents: false,
            isShareInfo: false
        };
    }

    componentDidMount () {
        const { wishlist, product, activeColor } = this.props;

        this.setState({
            isInWishlist: !!(wishlist.find(item => item.product.id === product.id) && !!wishlist.find(item => item.properties.size.color.id === activeColor.id))
        });
    }

    static getDerivedStateFromProps (props) {
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

    sizeListIsOpen = () => {
        this.setState({
            sizeListIsOpen: true
        });
    };

    selectIsOpen = () => {
        this.setState(({
            selectIsOpen: true
        }));
    };

    selectIsClosed = () => {
        this.setState(({
            selectIsOpen: false
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
        const { product, activeSize, activeColor } = this.props;
        const { checkedFeatureIds } = this.state;
        const sharesPresent = activeSize.shares && activeSize.shares.filter(share => share.type === 'present');

        if (sharesPresent && sharesPresent.length) {
            this.openPopupPresents();
            return;
        }

        this.saveProductToBasket(product.id, activeSize, activeColor, checkedFeatureIds);
    };

    saveProductToBasket = (productId, activeSize, activeColor, checkedFeatureIds = {}) => {
        return this.props.saveProductsToBasket({
            productId,
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

    handleWithoutPresentsClick = () => {
        const { product, activeSize, activeColor } = this.props;
        const { checkedFeatureIds } = this.state;

        this.saveProductToBasket(product.id, activeSize, activeColor, checkedFeatureIds);
    };

    handleWithPresentsClick = (presents) => {
        const { product, activeSize, activeColor } = this.props;
        const { checkedFeatureIds } = this.state;

        this.saveProductToBasket(product.id, activeSize, activeColor, checkedFeatureIds)
            .then(() => {
                this.addPresentsToBasket(presents);
            });
    };

    addPresentsToBasket = (presents) => {
        if (presents.length) {
            const present = presents[0];

            this.saveProductToBasket(present.id, present.activeSize, present.activeColor)
                .then(() => {
                    this.addPresentsToBasket(presents.splice(1));
                });
        }
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

    changeColorListOpen = () => this.setState({ colorListOpen: true });

    changeColorListClose = () => this.setState(({ colorListOpen: false }));

    handleChangePopup = (activePopupColorIndex) => {
        this.setState({
            activePopupColorIndex: typeof (activePopupColorIndex) === 'number'
                ? activePopupColorIndex
                : null,
            colorListOpen: false
        });
    };

    handleChangePopupSizes = () => () => {
        this.setState((state) => ({ isPopupSizes: !state.isPopupSizes }));
    };

    handleChangeColor = (color) => {
        this.state.colorListOpen ? this.changeColorListClose() : this.changeColorListOpen();
        this.props.changeColor(color);
    };

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
    };

    handleChangeSize = (size) => {
        this.setState({ checkedFeatureIds: {} });
        this.props.changeSize(size);
    };

    handleShowShareInfo = () => {
        const { isShareInfo } = this.state;
        const { outsideClickEnabled, turnOnClickOutside } = this.props;

        if (isShareInfo) {
            return this.closeShareInfo();
        }

        this.setState({ isShareInfo: true });
        !outsideClickEnabled && turnOnClickOutside(this.shareInfo.current, this.closeShareInfo);
    };

    closeShareInfo = () => {
        this.setState({ isShareInfo: false });
    };

    getProductLink = (product) => {
        const { langRoute, categories, subCategories } = this.props;
        const categoryAlias = (find(category => category.id === product.categoryId, categories) || {}).alias;
        const subCategoryAlias = (find(subCategory => subCategory.id === product.subCategoryId, subCategories) || {}).alias;
        const link = `${langRoute}/${categoryAlias + '/' + subCategoryAlias}/${product.alias}`;

        return link;
    };

    openPopupPresents = () => {
        this.setState({ isPopupPresents: true });
    };

    handleClosePopupPresents = () => {
        this.setState({ isPopupPresents: false });
    };

    render () {
        const { product, langMap, lang, activeSize, activeColor, isPromotion, subCategory, products, productAnimation } = this.props;
        const {
            sizes,
            sizeListIsOpen,
            selectIsOpen,
            isInWishlist,
            isInBasket,
            colorListOpen,
            checkedFeatureIds,
            activePopupColorIndex,
            isPopupSizes,
            isPopupPresents,
            isShareInfo
        } = this.state;
        const text = propOr('product', {}, langMap);
        const isExist = propOr('exist', 'true', product);
        const isDiscount = !!activeColor.discountPrice;
        const shortDescription = product.texts[lang].shortDescription;
        const colors = activeSize.colors;
        const actualSizes = isPromotion
            ? sizes[lang].filter(size => size.colors.some(color => color.action))
            : sizes[lang];
        const actualColors = isPromotion ? colors.filter(color => color.action) : colors;
        const isOneSize = actualSizes.length === 1;
        const isOneColor = actualColors.length === 1;
        const features = activeSize.features || [];
        const checkedFeatures = features.filter(feature => checkedFeatureIds[feature.id]);
        const featuresPrice = checkedFeatures.reduce((sum, { value }) => sum + value, 0);
        const resultPrice = (activeColor.discountPrice || activeColor.price) + featuresPrice;
        const isTableSizes = actualSizes.some(size => size.tableSizes && size.tableSizes.length);
        const shares = activeSize.shares || [];
        const sharesDiscount = shares.filter(share => share.type === 'discount');
        const sharesPresent = shares.filter(share => share.type === 'present');

        return <div className={classNames(styles.root, {
            [styles.animated]: productAnimation
        })}>
            <AboutProductTop article={activeColor.article} product={product} productAnimation={productAnimation}/>
            <div className={styles.middle}>
                {shortDescription &&
                <p className={styles.advantage} dangerouslySetInnerHTML={{ __html: this.convertNewLinesToBr(shortDescription) }} />}
                <div className={styles.details} onClick={this.scrollToTitles}>{text.details}</div>
                <div className={styles.priceTag}>
                    <span className={styles.priceTagPriceWrapper}>
                        {isDiscount &&
                    <span className={styles.priceOld}>
                        {formatMoney(activeColor.price)}
                    </span>}
                        <span className={classNames(styles.price, styles.discountPrice)}>
                            {formatMoney(resultPrice)}
                        </span>
                    </span>
                    <div className={classNames(styles.existText, { [styles.notExist]: isExist === 'false' })}>
                        {isExist === 'true' ? langMap.exist.inStock : langMap.exist.order}
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <div className={styles.properties}>
                    <div className={styles.sizesWrap}>
                        <div className={styles.sizesTitle}>
                            {!isOneSize ? text.size : text.oneSize}
                            <div onClick={this.handleChangePopupSizes()} className={classNames(
                                styles.sizesTitleMark,
                                { [styles.visible]: isTableSizes })} >
                                <img
                                    className={styles.sizesTitleMarkImg}
                                    src="/src/apps/client/ui/components/AboutProduct/img/questionMarkWhite.svg"
                                    width="18" height="18" alt={text.sizesMarkDescr} />
                            </div>
                        </div>
                        <SizesSelect
                            selectIsOpen={selectIsOpen}
                            activeSize={activeSize}
                            sizes={sizes}
                            sizeListIsOpen={sizeListIsOpen}
                            isPromotion={isPromotion}
                            lang={lang}
                            sizeListIsOpenSwitch={this.sizeListIsOpen}
                            selectIsOpenSwitch={this.selectIsOpen}
                            selectIsClosedSwitch={this.selectIsClosed}
                            handleChangeSize={this.handleChangeSize}
                            additionalClass='aboutProduct'
                        />
                    </div>
                    {(!isOneColor || product.viewOneColor) && <div className={classNames(styles.colorWrap, { [styles.active]: colorListOpen })}>
                        <div className={styles.colorTitle}>
                            {text.chooseColor}
                        </div>
                        <ColorsSelect
                            styles={styles}
                            activeSize={activeSize}
                            isPromotion={isPromotion}
                            activeColor={activeColor}
                            handleChangeColor={this.handleChangeColor}
                            changeColorListOpen={this.changeColorListOpen}
                            changeColorListClose={this.changeColorListClose}
                            handleChangePopup={this.handleChangePopup}
                            colorListOpen={colorListOpen}
                            withPopup
                        />
                    </div>}
                </div>
                <div className={styles.features}>
                    {features && features.map(feature => {
                        return <label key={feature.id} className={styles.feature}>
                            <input type="checkbox" checked={checkedFeatureIds[feature.id]} className={styles.featureInput}
                                onChange={this.handleCheckboxChange} name={feature.id} />
                            <span className={styles.featureCheckmark} />
                            {feature.name} (<span className={styles.featureValue}>{` + ${formatMoney(feature.value)} `}</span>)
                        </label>;
                    })}
                </div>
                <div className={styles.buttons}>
                    <div className={styles.simpleButtons}>
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
                    {!!(sharesDiscount.length || sharesPresent.length) && <div ref={this.shareInfo} className={styles.shareInfoWrap}>
                        {isShareInfo && <div className={styles.shareInfo}>
                            {!!sharesDiscount.length && <div className={styles.shareInfoDiscount}>
                                <div className={styles.shareInfoDescr}>
                                    {text.getShareDiscount1}
                                    {sharesDiscount.map(share => {
                                        return <span className={styles.shareInfoProductDiscount}>
                                                (<span className={styles.shareInfoProductDiscountValue}>
                                                {` - ${formatMoney(share.value)} `}
                                            </span>)
                                        </span>;
                                    })}
                                    {text.getShareDiscount2}
                                    {sharesDiscount.some(share => share.products.length > 1) && text.groupOfProducts}
                                :
                                </div>
                                <ul className={styles.shareInfoProducts}>
                                    {sharesDiscount.map(share => {
                                        return <li>
                                            {share.products.map(shareProduct => {
                                                const product = find(product => product.id === shareProduct.value, products);
                                                const link = this.getProductLink(product);

                                                return <li className={styles.shareInfoProductItem}>
                                                    <Link
                                                        to={link}
                                                        className={styles.shareInfoProductLink}
                                                        href="#" target='_blank'>
                                                        {shareProduct.label}
                                                    </Link>
                                                </li>;
                                            })}
                                        </li>;
                                    })}
                                </ul>
                            </div>}
                            {!!sharesPresent.length && <div className={styles.shareInfoPresent}>
                                <div className={styles.shareInfoDescr}>
                                    {sharesDiscount.length ? text.getSharePresent : text.getSharePresent}
                                    <span className={styles.shareInfoDescrSpan}>&nbsp;{text.atChoice}</span></div>
                                <ul className={styles.shareInfoProducts}>
                                    {sharesPresent.map(share => {
                                        return <li>
                                            {share.products.map(shareProduct => {
                                                const product = find(product => product.id === shareProduct.value, products);
                                                const link = this.getProductLink(product);

                                                return <li className={styles.shareInfoProductItem}>
                                                    <Link
                                                        to={link}
                                                        className={styles.shareInfoProductLink}
                                                        href="#" target='_blank'>
                                                        {shareProduct.label}
                                                    </Link>
                                                </li>;
                                            })}
                                        </li>;
                                    })}
                                </ul>
                            </div>}
                            <div className={styles.closePromotion} onClick={this.closeShareInfo}>
                                <img src="/src/apps/client/ui/components/AboutProduct/img/cross.svg" alt="close"/>
                            </div>
                        </div>}
                        <button className={classNames(styles.shareInfoBtn, { [styles.active]: isShareInfo })} onClick={this.handleShowShareInfo}>
                            {text.share}
                        </button>
                    </div>}
                </div>
                {activePopupColorIndex !== null && <PopupColor
                    colors={actualColors}
                    activeIndex={activePopupColorIndex}
                    closePopup={this.handleChangePopup}
                    handleChangeColor={this.handleChangeColor}
                />}
                {isPopupSizes && <PopupSizes sizes={actualSizes} closePopup={this.handleChangePopupSizes} subCategory={subCategory} />}
                {isPopupPresents && <PopupPresents
                    shares={sharesPresent}
                    closePopup={this.handleClosePopupPresents}
                    isPromotion={isPromotion}
                    disagree={this.handleWithoutPresentsClick}
                    agree={this.handleWithPresentsClick} />}
                {isPopupSizes && <PopupSizes sizes={actualSizes} closePopup={this.handleChangePopupSizes} subCategory={subCategory} />}
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutProduct);

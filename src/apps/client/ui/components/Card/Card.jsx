import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import pathOr from '@tinkoff/utils/object/pathOr';
import find from '@tinkoff/utils/array/find';
import includes from '@tinkoff/utils/array/includes';

import SizesSelect from '../SizesSelect/SizesSelect';

import saveProductsToBasket from '../../../services/client/saveProductsToBasket';

import styles from './Card.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        langRoute: application.langRoute,
        categories: data.categories,
        subCategories: data.subCategories,
        basket: data.basket
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload))
    };
};

class Card extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        langRoute: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        product: PropTypes.object.isRequired,
        newClass: PropTypes.string,
        labelClass: PropTypes.string,
        categories: PropTypes.array,
        subCategories: PropTypes.array,
        setSliderWidth: PropTypes.func,
        isPromotion: PropTypes.bool,
        activeSizes: PropTypes.array,
        basket: PropTypes.array,
        handleOpenBasket: PropTypes.func,
        saveProductsToBasket: PropTypes.func
    };

    static defaultProps = {
        newClass: '',
        labelClass: '',
        categories: [],
        subCategories: [],
        activeSizes: [],
        setSliderWidth: () => {}
    };

    state = {
        category: {},
        subCategory: {},
        lang: PropTypes.string.isRequired,
        selectIsOpen: false,
        sizeListIsOpen: true,
        activeSize: this.props.product.sizes[this.props.lang][0],
        activeColor: this.props.product.sizes[this.props.lang][0].colors[0],
        isInBasket: false
    };

    componentDidMount () {
        const { product, categories, subCategories } = this.props;

        this.setState({
            categoryAlias: (find(category => category.id === product.categoryId, categories) || {}).alias,
            subCategoryAlias: (find(subCategory => subCategory.id === product.subCategoryId, subCategories) || {}).alias
        });
    }

    static getDerivedStateFromProps (props, state) {
        const { basket, product } = props;
        let values = {};

        values.isInBasket = basket.find(item => (item.product.id === product.id) && item.properties.size.color.id === state.activeColor.id);

        return values;
    }

    getIsShareByType = (type) => {
        const { product, lang } = this.props;
        const sizes = pathOr(['sizes', lang], [], product);
        const isShare = sizes.some(size => (size.shares || []).some(share => share.type === type));

        return isShare;
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

    handleChangeSize = (size) => {
        this.setState({ checkedFeatureIds: {} });
        const { isPromotion } = this.props;
        let activeColor = size.colors[0];

        if (isPromotion) {
            const activeColorIndex = size.colors.findIndex(color => color.action);

            activeColor = size.colors[activeColorIndex];
        }

        this.setState({ activeSize: size, activeColor });
    };

    handleBuyClickOnCard = (e) => {
        e.preventDefault();

        const { product } = this.props;
        const { checkedFeatureIds, activeSize, activeColor } = this.state;
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

    render () {
        const {
            product: { texts, avatar, minDiscount, actualPrice, minPrice, alias, labels, sizes, exist },
            newClass,
            labelClass,
            langRoute,
            lang,
            setSliderWidth,
            isPromotion,
            langMap,
            activeSizes
        } = this.props;
        const { categoryAlias, subCategoryAlias, isInBasket, selectIsOpen, sizeListIsOpen, activeSize } = this.state;
        const text = propOr('product', {}, langMap);
        const isExist = exist || 'true';
        let minActivePrice = minPrice;
        let minActualPrice = actualPrice;
        let isDiscount = minActivePrice !== minActualPrice;
        const isSharePresent = this.getIsShareByType('present');
        const isShareDiscount = this.getIsShareByType('discount');
        const actualSizes = isPromotion
            ? sizes[lang].filter(size => size.colors.some(color => color.action))
            : sizes[lang];
        const isOneSize = actualSizes.length === 1;

        if (activeSizes.length >= 1) {
            const activePrices = sizes.ru.filter(({ name }) => includes(name, activeSizes));

            if (activePrices.length) {
                const minDiscountPrice = activePrices[0].colors[0].discountPrice;
                minActivePrice = activePrices[0].colors[0].price;
                minActualPrice = minDiscountPrice || minActivePrice;
                isDiscount = minActivePrice !== minActualPrice;
            }
        }

        return (
            <Link
                className={classNames(
                    styles.product,
                    { [styles[newClass]]: newClass },
                    { [styles[labelClass]]: labelClass }
                )}
                to={`${langRoute}/${isPromotion ? 'promotions' : categoryAlias + '/' + subCategoryAlias}/${alias}`}
            >
                <div className={styles.labels}>
                    {labels.sort().reverse().map(label => {
                        return <div key={label} className={classNames(styles.label, styles[label])}>
                            {text[label]}
                        </div>;
                    })}
                    {!!minDiscount && <div className={classNames(styles.label, styles.discount)}>
                        -{minDiscount}<span className={styles.percentage}>%</span>
                    </div>}
                    {isSharePresent && <div className={classNames(styles.label, styles.share)}>
                        {text.sharePresent}
                    </div>}
                    {isShareDiscount && <div className={classNames(styles.label, styles.share)}>
                        {text.shareDiscount}
                    </div>}
                </div>
                <div className={styles.imgWrap}>
                    <img className={styles.img} src={avatar} width='220' height='220' alt='' onLoad={setSliderWidth}/>
                </div>
                <div className={classNames(styles.existText, { [styles.notExist]: isExist === 'false' })}>
                    {isExist === 'true' ? langMap.exist.inStock : langMap.exist.order}
                </div>
                <div className={styles.bottomPanel}>
                    <p className={styles.productName}>
                        {texts[lang].name}
                    </p>

                    {isDiscount ? <div className={styles.priceOld}>
                        {minActivePrice} &#8372;
                    </div> : null}
                    <div className={classNames(styles.price, { [styles.discountPrice]: isDiscount })}>
                        {minActualPrice} &#8372;
                    </div>
                    <div className={styles.hoverInformation} onClick={(e) => { e.preventDefault(); }}>
                        <button
                            className={classNames(styles.btnBuy, { [styles.active]: isInBasket })}
                            onClick={!isInBasket ? this.handleBuyClickOnCard : this.props.handleOpenBasket}>
                            {!isInBasket
                                ? text.buy
                                : text.inBasket
                            }
                        </button>
                        <div className={styles.sizesWrap}>
                            <div className={styles.sizesTitle}>
                                {!isOneSize ? text.size : text.oneSize}
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
                                isCardSelect = {true}
                            />
                        </div>
                    </div>
                </div>
            </Link>);
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Card));

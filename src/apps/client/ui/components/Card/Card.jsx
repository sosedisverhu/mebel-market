import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';
import includes from '@tinkoff/utils/array/includes'

import styles from './Card.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        langRoute: application.langRoute,
        categories: data.categories,
        subCategories: data.subCategories
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
        isPromotion: PropTypes.bool
    };

    static defaultProps = {
        newClass: '',
        labelClass: '',
        categories: [],
        subCategories: [],
        setSliderWidth: () => {}
    };

    state = {
        category: {},
        subCategory: {},
        lang: PropTypes.string.isRequired
    };

    componentDidMount () {
        const { product, categories, subCategories } = this.props;

        this.setState({
            categoryAlias: (find(category => category.id === product.categoryId, categories) || {}).alias,
            subCategoryAlias: (find(subCategory => subCategory.id === product.subCategoryId, subCategories) || {}).alias
        });
    }

    render () {
        const {
            product: { texts, avatar, minDiscount, actualPrice, minPrice, alias, labels, sizes },
            newClass,
            labelClass,
            langRoute,
            lang,
            setSliderWidth,
            isPromotion,
            langMap,
            activeSizes
        } = this.props;
        const { categoryAlias, subCategoryAlias } = this.state;
        const isDiscount = minPrice !== actualPrice;
        const text = propOr('product', {}, langMap);

        console.log(this.props.product);
        console.log(activeSizes);

        const activePrices = sizes.ru.filter(({ name }) => includes(name, activeSizes));
        let minActivePrice;
        let minDiscountPrice;
        console.log(activePrices);

        if(activePrices.length >= 1) {
            minActivePrice = activePrices[0].colors[0].price;
            minDiscountPrice = activePrices[0].colors[0].discountPrice;
        }
        console.log(minActivePrice);
        console.log(minDiscountPrice);
  
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
                </div>
                <div className={styles.imgWrap}>
                    <img className={styles.img} src={avatar} width='220' height='220' alt='' onLoad={setSliderWidth}/>
                </div>
                <div className={styles.bottomPanel}>
                    <p className={styles.productName}>
                        {texts[lang].name}
                    </p>

                    {isDiscount ? <div className={styles.priceOld}>
                        {minPrice} &#8372;
                    </div> : null}
                    <div className={classNames(styles.price, { [styles.discountPrice]: isDiscount })}>
                        {actualPrice} &#8372;
                    </div>

                </div>
            </Link>);
    }
}

export default withRouter(connect(mapStateToProps)(Card));

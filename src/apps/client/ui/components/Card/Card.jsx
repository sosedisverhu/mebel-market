import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';

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

    getLabels = (labels, discount) => {
        if (discount) {
            return labels.map((label, index) => {
                return (
                    <div key={index} className={`${styles.label} ${styles.discount}`}>
                        -{discount}<span className={styles.percentage}>%</span>
                    </div>);
            });
        } else if (labels) {
            return labels.map((label, index) => {
                return label === 'top' &&
                    <div key={index} className={`${styles.label} ${styles.hit}`}>
                        {propOr('product', {}, this.props.langMap).labelTop}
                    </div>;
            });
        }
    };

    render () {
        const {
            product: { texts, avatar, minDiscount, actualPrice, minPrice, alias },
            newClass,
            labelClass,
            langRoute,
            lang,
            setSliderWidth,
            isPromotion
        } = this.props;
        const { categoryAlias, subCategoryAlias } = this.state;
        const isDiscount = minPrice !== actualPrice;

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
                    {this.getLabels(['top'], minDiscount)}
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

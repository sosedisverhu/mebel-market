import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

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
        subCategories: PropTypes.array
    };

    static defaultProps = {
        newClass: '',
        labelClass: '',
        categories: [],
        subCategories: []
    };

    state = {
        category: {},
        subCategory: {}
    };

    componentDidMount () {
        const { product, categories, subCategories } = this.props;

        this.setState({
            categoryAlias: find(category => category.id === product.categoryId, categories).alias,
            subCategoryAlias: find(subCategory => subCategory.id === product.subCategoryId, subCategories).alias
        });
    }

    getLabels = (labels, discount) => {
        if (discount) {
            return labels.map((label, index) => {
                return (
                    <div key={index} className={`${styles.label} ${styles.discount}`}>
                        -{discount} %
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
            product: { texts, avatar, discount, discountPrice, price, alias },
            newClass,
            labelClass,
            langRoute,
            lang
        } = this.props;
        const { categoryAlias, subCategoryAlias } = this.state;

        return (
            <Link
                className={classNames(
                    styles.product,
                    { [styles[newClass]]: newClass },
                    { [styles[labelClass]]: labelClass }
                )}
                to={`${langRoute}/${categoryAlias}/${subCategoryAlias}/${alias}`}
            >
                <div className={styles.labels}>
                    {this.getLabels(['top'], discount)}
                </div>
                <div>
                    <img className={styles.img} src={avatar} alt=''/>
                </div>
                <div className={styles.bottomPanel}>
                    <div className={styles.title}>
                        {texts[lang].name}
                    </div>
                    {discount ? <div className={styles.priceOld}>
                        {price} &#8372;
                    </div> : null}
                    <div className={styles.price}>
                        {discountPrice} &#8372;
                    </div>
                </div>
            </Link>);
    }
}

export default withRouter(connect(mapStateToProps)(Card));

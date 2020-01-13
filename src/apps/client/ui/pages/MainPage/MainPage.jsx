import React, { Component } from 'react';
import PropTypes from 'prop-types';
import propOr from '@tinkoff/utils/object/propOr';
import includes from '@tinkoff/utils/array/includes';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { MAX_NEW_PROSUCTS } from '../../../constants/constants';

import styles from './MainPage.css';
import Slider from '../../components/Slider/Slider';
import ProductsSlider from '../../components/ProductsSlider/ProductsSlider';
import MainCategories from '../../components/MainCategories/MainCategories';
import Advantages from '../../components/Advantages/Advantages';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        products: data.products,
        labels: data.labels
    };
};

class MainPage extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        labels: PropTypes.array.isRequired,
        products: PropTypes.array.isRequired
    };

    render () {
        const { langMap, products, labels } = this.props;
        const text = propOr('mainPage', {}, langMap);

        const productsResult = products
            .sort((prev, next) => next.date - prev.date)
            .reduce((result, product) => {
                if (includes('top', product.labels)) {
                    (result.top) ? result.top.push(product) : result.top = [product];
                }

                if (product.discountPrice) {
                    (result.discount) ? result.discount.push(product) : result.discount = [product];
                }

                if (result.new) {
                    if (result.new.length < MAX_NEW_PROSUCTS) {
                        result.new.push(product);
                    }
                } else {
                    result.new = [product];
                }

                return result;
            }, {});

        return (
            <div>
                <Slider />
                {labels.map((label, i) => {
                    return (
                        <div key={i}>
                            {productsResult[label] &&
                                <section key={label} className={classNames(styles.categorySection, styles[label])}>
                                    <h2 className={styles.title}>{text[label]}</h2>
                                    <ProductsSlider label={label} products={productsResult[label]} />
                                </section>
                            }
                        </div>);
                })}
                <MainCategories />
                <Advantages />
            </div>);
    }
}

export default connect(mapStateToProps)(MainPage);

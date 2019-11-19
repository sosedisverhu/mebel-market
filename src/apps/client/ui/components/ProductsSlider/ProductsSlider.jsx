import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './ProductsSlider.css';
import Card from '../Card/Card';

class ProductsSlider extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        products: PropTypes.array.isRequired
    };

    render () {
        const { products, label } = this.props;

        return (
            <div className={classNames(styles.slider, styles[label])}>
                <div className={styles.content}>
                    <div className={styles.products}>
                        <div className={styles.productsPack}>
                            {products.map(product => <Card key={product.id} product={product} />)}
                        </div>
                        <div className={styles.productsPack}>
                            {products.map(product => <Card key={product.id} product={product} />)}
                        </div>
                    </div>
                </div>
                <div className={styles.left} />
                <div className={styles.right} />
                <div className={styles.switch}>
                    <div className={styles.ellipse}></div>
                    <div className={classNames(styles.ellipse, styles.active)}></div>
                    <div className={styles.ellipse}></div>
                </div>
            </div>);
    }
}

export default connect()(ProductsSlider);

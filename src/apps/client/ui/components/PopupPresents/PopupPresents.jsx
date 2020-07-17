import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import classNames from 'classnames';

import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';

import PresentProductCard from '../PresentProductCard/PresentProductCard';

import styles from './PopupPresents.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        products: data.products,
        categories: data.categories,
        subCategories: data.subCategories
    };
};

class PopupPresents extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        closePopup: PropTypes.func.isRequired,
        disagree: PropTypes.func.isRequired,
        agree: PropTypes.func.isRequired,
        shares: PropTypes.array.isRequired,
        products: PropTypes.array.isRequired,
        categories: PropTypes.array.isRequired,
        subCategories: PropTypes.array.isRequired
    };

    constructor (props) {
        super(props);
        const { shares, lang, products } = this.props;

        const sharesNew = [...shares].map(share => {
            const newProducts = share.products.map(shareProduct => {
                const product = find(product => product.id === shareProduct.value, products);
                const { sizes } = product;
                const activeSize = sizes[lang][0];
                const activeColor = sizes[lang][0].colors[0];

                const newProduct = { ...product, activeSize, activeColor };

                return newProduct;
            });

            const newShare = { ...share, products: newProducts };

            return newShare;
        });

        this.state = {
            activeShareId: sharesNew[0].id,
            shares: sharesNew
        };

        this.popup = React.createRef();
    }

    componentDidMount () {
        disableBodyScroll(this.popup.current);
    }

    componentWillUnmount () {
        clearAllBodyScrollLocks();
    }

    handleShareChange = activeShareId => {
        this.setState({ activeShareId });
    };

    handleChangeShareProductColor = (shareId, productId) => (activeColor) => {
        const shares = [...this.state.shares];

        shares.forEach(share => {
            if (share.id === shareId) {
                share.products.forEach(product => {
                    if (product.id === productId) {
                        product.activeColor = activeColor;
                    }
                });
            }
        });

        this.setState({ shares });
    };

    handleChangeShareProductSize = (shareId, productId) => (activeSize) => {
        const shares = [...this.state.shares];

        shares.forEach(share => {
            if (share.id === shareId) {
                share.products.forEach(product => {
                    if (product.id === productId) {
                        product.activeSize = activeSize;
                        product.activeColor = activeSize.colors[0];
                    }
                });
            }
        });

        this.setState({ shares });
    };

    handleDisagreeClick = () => {
        this.props.closePopup();
        this.props.disagree();
    };

    handleAgreeClick = () => {
        const { shares, activeShareId } = this.state;
        const activeShare = find(share => share.id === activeShareId, shares);

        this.props.closePopup();
        this.props.agree(activeShare.products);
    };

    render () {
        const { lang, langMap } = this.props;
        const { activeShareId, shares } = this.state;
        const text = propOr('product', {}, langMap);

        return <div className={styles.root}>
            <div className={styles.cover} onClick={this.props.closePopup} />
            <div className={styles.popupWrap}>
                <div className={styles.popup}>
                    <div className={styles.popupContent} ref={this.popup} >
                        <h3 className={styles.title}>Выберите подарок</h3>
                        <div className={styles.shares}>
                            {shares.map(share => {
                                return <label className={classNames(styles.share, { [styles.shareManyProducts]: share.products.length > 1 })}>
                                    <div className={styles.shareProductCards}>
                                        {share.products.map(product => {
                                            return <PresentProductCard key={`${share.id}-${product.id}`} product={product} isActive={share.id === activeShareId}
                                                changeColor={this.handleChangeShareProductColor(share.id, product.id)}
                                                changeSize={this.handleChangeShareProductSize(share.id, product.id)}

                                            />;
                                        })}
                                    </div>
                                    <div className={classNames(styles.radioLabel, { [styles.active]: share.id === activeShareId })}>
                                        <input
                                            className={styles.radioInput}
                                            type="radio"
                                            name="deliveryChecked"
                                            checked={share.id === activeShareId}
                                            value={share.id}
                                            onChange={(e) => this.handleShareChange(e.target.value)}
                                        />
                                        <div className={styles.radioContent}>
                                            {share.products.map(product => {
                                                return <div key={product.id}
                                                    className={styles.shareProductName}>
                                                    {product.texts[lang].name}
                                                </div>;
                                            })}
                                            <span className={styles.radioCheckmark} />
                                        </div>
                                    </div>
                                </label>;
                            })}

                        </div>
                        <div className={styles.buttons}>
                            <button className={styles.btnWithoutPresent} onClick={this.handleDisagreeClick}>Спасибо, подарок не нужен</button>
                            <button className={styles.btnConfirm} onClick={this.handleAgreeClick}>Подтвердить</button>
                        </div>
                        <div onClick={this.props.closePopup} className={styles.close} />
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(PopupPresents);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick.jsx';
import propOr from '@tinkoff/utils/object/propOr';

import styles from './WishList.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

@outsideClick
class WishList extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    };

    state = {
        active: false
    }

    handlePopupClose = () => {
        document.body.style.overflowY = 'visible';
        this.setState({
            active: false
        });
    }

    handleClick = () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;

        document.body.style.overflowY = (!active) ? 'hidden' : 'visible';
        this.setState(state => ({ active: !state.active }));

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handlePopupClose);
        }
    }

    render () {
        const { langMap } = this.props;
        const { active } = this.state;
        const text = propOr('wishList', {}, langMap);

        return (
            <div className={styles.wishList}>
                <div className={styles.wishListWrapper} onClick={this.handleClick}>
                    <img src="/src/apps/client/ui/components/WishList/img/wish.svg" alt="wish list icon"/>
                    <span className={styles.quantityAll}>2</span>
                </div>
                <div className={classNames(styles.popupContainer, { [styles.active]: active })}>
                    <div className={styles.popup}>
                        <p className={styles.title}>{text.title}</p>
                        <div className={styles.productsContainer}>
                            <div className={styles.wishItemWrapper}>
                                <div className={styles.wishItem}>
                                    <img className={styles.productImg} src="" alt=""/>
                                    <div>
                                        <p className={styles.productName}>Кровать «Анталия»</p>
                                        <p className={styles.productNumber}>Артикул: 48092</p>
                                        <p className={styles.productSize}>{text.size} 190 х 200</p>
                                        <div className={styles.productPrices}>
                                            <p className={styles.productOldPrice}>2 798&#8372;</p>
                                            <p className={styles.productPrice}>1 399&#8372;</p>
                                        </div>
                                    </div>
                                    <div className={styles.productButtons}>
                                        <button className={styles.removeBtn}>
                                            <img className={styles.removeBtnImg} src="src/apps/client/ui/components/Header/img/remove.png" alt="remove"/>
                                        </button>
                                        <button className={styles.cartBtn}>{text.cartBtn}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className={styles.continueShopping} onClick={this.handlePopupClose}>{text.continueShopping}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(WishList);

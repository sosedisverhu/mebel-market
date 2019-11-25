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
        langMap: PropTypes.object.isRequired
    };

    state = {
        active: false
    }

    handleClick = () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;

        this.setState(state => ({ active: !state.active }));

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleClose);
        }
    }

    render () {
        const { langMap } = this.props;
        const { active } = this.state;
        const text = propOr('wishList', {}, langMap);

        return (
            <div className={styles.wishList}>
                <div className={styles.wishListWrapper} onClick={this.handleClick}>
                    <div className={styles.iconWishList} />
                    <span className={styles.quantityAll}>2</span>
                </div>
                {/*<div className={classNames(styles.popupContainer, { [styles.active]: active })}>
                    <div className={styles.cover}/>
                    <div className={styles.popup}>
                        <p className={styles.title}>{text.title}</p>
                        <button className={styles.continueShopping} onClick={this.handleClick}>{text.continueShopping}</button>
                    </div>
                </div>*/}
                <div className={classNames(styles.popup, { [styles.active]: active })}>
                    <div className={styles.cover}/>
                    <div className={styles.test}>
                        <p className={styles.title}>{text.title}</p>
                        <button className={styles.continueShopping} onClick={this.handleClick}>{text.continueShopping}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(WishList);

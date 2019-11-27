import React, { Component } from 'react';
import PropTypes from 'prop-types';

import propOr from '@tinkoff/utils/object/propOr';

import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import { connect } from 'react-redux';

import styles from './PopupOrder.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class PopupOrder extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        delivery: PropTypes.string.isRequired,
        payment: PropTypes.string.isRequired,
        onPopupChange: PropTypes.func.isRequired
    };

    popup = React.createRef();

    componentDidMount () {
        disableBodyScroll(this.popup.current);
    }

    componentWillUnmount () {
        clearAllBodyScrollLocks();
    }

    render () {
        const { langMap, delivery, payment, onPopupChange } = this.props;
        const text = propOr('checkoutPage', {}, langMap);

        return <div className={styles.root}>
            <div className={styles.cover} onClick={onPopupChange} />
            <div className={styles.popup} ref={this.popup} >
                <div className={styles.message}>
                    <h2 className={styles.title}>{text.popupTitle} №123456</h2>
                    {(delivery === 'pickup')
                        ? (
                            <div>
                                <div className={styles.address}>
                                    <p className={styles.addressTitle}>{text.addressTitle}</p>
                                    <p className={styles.addressText}>{text.addressText}</p>
                                </div>
                                <div className={styles.phones}>
                                    <a className={styles.phone} href="tel:+380500511000">(050) 051-10-00</a>
                                    <a className={styles.phone} href="tel:+380679000522">(067) 900-05-22</a>
                                </div>
                            </div>)
                        : null}
                    {(delivery === 'post')
                        ? <p className={styles.sms}>{text.sms}</p>
                        : null}
                    {(payment === 'card')
                        ? (
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>{text.cardTitle}</div>
                                <div className={styles.cardCode}>1234 5678 9012 3456</div>
                                <div className={styles.cardDescr}>{text.cardDescr}</div>
                            </div>)
                        : null}
                    <h3 className={styles.price}>{text.price} <span className={styles.priceValue}>3 723₴</span></h3>
                </div>
                <div className={styles.close} onClick={onPopupChange} />
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(PopupOrder);

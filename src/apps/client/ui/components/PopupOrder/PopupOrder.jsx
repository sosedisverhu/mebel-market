import React, { Component } from 'react';
import PropTypes from 'prop-types';
import propOr from '@tinkoff/utils/object/propOr';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import formatMoney from '../../../utils/formatMoney';
import setBasket from '../../../actions/setBasket';

import styles from './PopupOrder.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        langRoute: application.langRoute
    };
};

const mapDispatchToProps = (dispatch) => ({
    setBasket: (...payload) => dispatch(setBasket(...payload))
});

class PopupOrder extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        langRoute: PropTypes.string.isRequired,
        delivery: PropTypes.object.isRequired,
        payment: PropTypes.object.isRequired,
        setBasket: PropTypes.func.isRequired,
        price: PropTypes.number.isRequired,
        orderId: PropTypes.string.isRequired
    };

    popup = React.createRef();

    componentDidMount () {
        disableBodyScroll(this.popup.current);
    }

    componentWillUnmount () {
        clearAllBodyScrollLocks();
    }

    handleClose = () => {
        this.props.setBasket([]);
    };

    render () {
        const { langMap, langRoute, delivery, payment, price, orderId } = this.props;
        const text = propOr('checkoutPage', {}, langMap);

        return <div className={styles.root}>
            <div className={styles.cover} />
            <div className={styles.popup} ref={this.popup} >
                <div className={styles.message}>
                    <h2 className={styles.title}>{`${text.popupTitle} № ${orderId}`}</h2>
                    {(delivery.id === 'pickup')
                        ? (
                            <div>
                                <div className={styles.address}>
                                    <p className={styles.addressTitle}>{text.addressTitle}</p>
                                    <p className={styles.addressText}>{text.addressText}</p>
                                </div>
                                <div className={styles.phones}>
                                    <a className={styles.phone} href="tel:+380679000522">(067) 900-05-22</a>
                                </div>
                            </div>)
                        : null}
                    {(delivery.id === 'post')
                        ? <p className={styles.sms}>{text.sms}</p>
                        : null}
                    {(payment.id === 'card')
                        ? (
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>{text.cardTitle}</div>
                                <div className={styles.cardCode}>1234 5678 9012 3456</div>
                                <div className={styles.cardDescr}>{text.cardDescr}</div>
                            </div>)
                        : null}
                    <h3 className={styles.price}>{text.price} <span className={styles.priceValue}>{formatMoney(price)}</span></h3>
                    <Link to={`${langRoute}/`} onClick={this.handleClose} className={styles.link}>{text.toMain}</Link>
                </div>
                <Link to={`${langRoute}/`} onClick={this.handleClose} className={styles.close} />
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupOrder);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';
import noop from '@tinkoff/utils/function/noop';

import styles from './CheckoutPage.css';
import PopupOrder from '../../components/PopupOrder/PopupOrder';

const deliveryOptions = [
    {
        id: 'pickup',
        texts: {
            ru: { option: 'Самовывоз', description: '(Адрес: г. Киев ул. Большая Окружная 4б)' },
            ua: { option: 'Самовивіз', description: '(Адреса: м. Київ вул. Велика Кільцува 4б)' }
        }
    },
    {
        id: 'post',
        texts: {
            ru: { option: 'Почтой' },
            ua: { option: 'Поштою' }
        }
    }
];

const paymentOptions = [
    {
        id: 'cash',
        texts: {
            ru: { option: 'В магазине' },
            ua: { option: 'В магазині' }
        }
    },
    {
        id: 'cod',
        texts: {
            ru: { option: 'Наложенный платеж' },
            ua: { option: 'Накладений платіж' }
        }
    },
    {
        id: 'card',
        texts: {
            ru: { option: 'На карту' },
            ua: { option: 'На картку' }
        }
    }
];

const customerInfo = [
    {
        type: 'text',
        name: 'customerName',
        required: true,
        texts: {
            ru: { placeholder: 'Имя *' },
            ua: { placeholder: 'Ім\'я *' }
        }
    },
    {
        type: 'email',
        name: 'customerEmail',
        required: true,
        texts: {
            ru: { placeholder: 'Email *' },
            ua: { placeholder: 'Email *' }
        }
    },
    {
        type: 'tel',
        name: 'customerTel',
        required: true,
        texts: {
            ru: { placeholder: 'Телефон *' },
            ua: { placeholder: 'Телефон *' }
        }
    },
    {
        type: 'text',
        name: 'customerAddress',
        required: false,
        texts: {
            ru: { placeholder: 'Адрес доставки' },
            ua: { placeholder: 'Адреса доставки' }
        }
    },
    {
        type: 'text',
        name: 'customerComment',
        required: false,
        texts: {
            ru: { placeholder: 'Комментарий' },
            ua: { placeholder: 'Коментар' }
        }
    }
];

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang,
        langMap: application.langMap
    };
};

class CheckoutPage extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired
    };

    state = {
        deliveryChecked: deliveryOptions[0].id,
        paymentChecked: paymentOptions[0].id,
        customerName: '',
        customerTel: '+380',
        customerEmail: '',
        customerComment: '',
        customerAddress: '',
        popupActive: false
    }

    handleChange = fieldName => e => {
        this.setState({ [fieldName]: e.target.value, [`${fieldName}Error`]: false });
    };

    handleBlur = fieldName => () => {
        this.setState({ [`${fieldName}Error`]: !this.state[fieldName] });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.handlePopupChange();
    }

    handlePopupChange = () => {
        this.setState({ popupActive: !this.state.popupActive });
    }

    render () {
        const { langMap, lang } = this.props;

        const { deliveryChecked, paymentChecked, popupActive } = this.state;
        const comment = find(item => item.name === 'customerComment', customerInfo);
        const text = propOr('checkoutPage', {}, langMap);

        return (
            <section className={styles.checkoutPage}>
                <form className={styles.content}>
                    <div className={styles.contentTop}>
                        <div className={styles.details}>
                            <h3 className={styles.h2}>{text.details}</h3>
                            <div className={styles.products}>
                                Products
                            </div>
                            <div className={styles.priceWrap}>
                                <p className={styles.priceRow}>{text.productPrice} <span>3 598₴</span></p>
                                <p className={styles.priceRow}>{text.deliveryPrice} <span>125₴</span></p>
                                <p className={styles.priceTotal}>{text.allPrice} <span>3 723₴</span></p>
                            </div>
                        </div>
                        <div className={styles.checkout}>
                            <h2 className={styles.h2}>{text.checkout}</h2>
                            {customerInfo.map((item, i) => {
                                if (item.name !== 'customerComment') {
                                    return (
                                        <input
                                            className={classNames(styles.infoInput, { [styles.checkoutInfoInputError]: this.state[`${item.name}Error`] })}
                                            key={i}
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.texts[lang].placeholder}
                                            value={this.state[item.name]}
                                            onChange={this.handleChange(item.name)}
                                            onBlur={item.required ? this.handleBlur(item.name) : noop}
                                        />);
                                }
                            })}
                            <div className={styles.deliveryAndPayment}>
                                <div className={styles.delivery}>
                                    <h3 className={styles.h3}>{text.delivery}</h3>
                                    {deliveryOptions.map((item, i) =>
                                        <label className={styles.radioLabel} key={i}>
                                            <input
                                                className={styles.radioInput}
                                                type="radio"
                                                name="deliveryChecked"
                                                checked={deliveryChecked === item.id}
                                                value={item.id}
                                                onChange={this.handleChange('deliveryChecked')}
                                            />
                                            <div className={styles.radioContent}>
                                                <span className={styles.radioCheckmark} />
                                                {item.texts[lang].option}
                                                {
                                                    item.texts[lang].description &&
                                                    <p className={styles.radioDescription}>{item.texts[lang].description}</p>
                                                }
                                            </div>
                                        </label>
                                    )}
                                </div>
                                <div className={styles.payment}>
                                    <h3 className={styles.h3}>{text.payment}</h3>
                                    {paymentOptions.map((item, i) =>
                                        <label className={styles.radioLabel} key={i}>
                                            <input
                                                className={styles.radioInput}
                                                type="radio"
                                                name="paymentChecked"
                                                checked={paymentChecked === item.id}
                                                value={item.id}
                                                onChange={this.handleChange('paymentChecked')}
                                            />
                                            <div className={styles.radioContent}>
                                                <span className={styles.radioCheckmark} />
                                                {item.texts[lang].option}
                                                {
                                                    item.texts[lang].description &&
                                                    <p className={styles.radioDescription}>{item.texts[lang].description}</p>
                                                }
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                            {comment
                                ? <textarea
                                    className={styles.infoTextArea}
                                    type={comment.type}
                                    name={comment.name}
                                    placeholder={comment.texts[lang].placeholder}
                                    value={this.state[comment.name]}
                                    onChange={this.handleChange(comment.name)}
                                    onBlur={comment.required ? this.handleBlur(comment.name) : noop}
                                />
                                : null}
                        </div>
                        <div className={classNames(styles.priceWrap, styles.mobile)}>
                            <p className={styles.priceRow}>{text.productPrice} <span>3 598₴</span></p>
                            <p className={styles.priceRow}>{text.deliveryPrice} <span>125₴</span></p>
                            <p className={styles.priceTotal}>{text.allPrice} <span>3 723₴</span></p>
                        </div>
                    </div>
                    <button type="submit" onClick={this.handleSubmit} className={styles.buttonSubmit}>{text.btnConfirm}</button>
                </form>
                {(popupActive)
                    ? <PopupOrder onPopupChange={this.handlePopupChange} delivery={deliveryChecked} payment={paymentChecked} />
                    : null}
            </section>
        );
    }
}

export default connect(mapStateToProps)(CheckoutPage);

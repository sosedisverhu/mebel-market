import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';
import noop from '@tinkoff/utils/function/noop';
import compose from '@tinkoff/utils/function/compose';
import each from '@tinkoff/utils/array/each';
import filter from '@tinkoff/utils/array/filter';

import styles from './CheckoutPage.css';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import PopupOrder from '../../components/PopupOrder/PopupOrder';
import CartProduct from '../../components/CartProduct/CartProduct';
import formatMoney from '../../../utils/formatMoney';

import saveOrder from '../../../services/client/saveOrder';

const deliveryOptions = [
    {
        id: 'pickup',
        texts: {
            ru: { option: 'Самовывоз', description: '(Адрес: г. Киев ул. Большая Окружная 4б)' },
            ua: { option: 'Самовивіз', description: '(Адреса: м. Київ вул. Велика Кільцева 4б)' }
        }
    },
    {
        id: 'post',
        texts: {
            ru: { option: 'Почтой' },
            ua: { option: 'Поштою' }
        },
        price: 125
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
        required: true,
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

const mapStateToProps = ({ application, data }) => {
    return {
        lang: application.lang,
        langMap: application.langMap,
        langRoute: application.langRoute,
        basket: data.basket
    };
};

const mapDispatchToProps = dispatch => ({
    saveOrder: (...payload) => dispatch(saveOrder(...payload))
});

class CheckoutPage extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        langRoute: PropTypes.string.isRequired,
        saveOrder: PropTypes.func.isRequired,
        basket: PropTypes.array.isRequired
    };

    requiredFieldsStart = React.createRef();

    state = {
        deliveryChecked: deliveryOptions[0],
        paymentChecked: paymentOptions[0],
        customerName: '',
        customerTel: '+380',
        customerEmail: '',
        customerComment: '',
        customerAddress: '',
        orderId: null
    };

    handleChange = fieldName => e => {
        this.setState({ [fieldName]: e.target.value, [`${fieldName}Error`]: false });
    };

    handleDeliveryChange = e => {
        const newDelivery = deliveryOptions.find(delivery => delivery.id === e.target.value);
        this.setState({ deliveryChecked: newDelivery, 'deliveryCheckedError': false });
    };

    handlePaymentChange = e => {
        const newPayment = paymentOptions.find(payment => payment.id === e.target.value);
        this.setState({ paymentChecked: newPayment, 'paymentCheckedError': false });
    };

    handleBlur = fieldName => () => {
        const { deliveryChecked } = this.state;

        if (deliveryChecked.id === 'pickup' && fieldName === 'customerAddress') {
            this.setState({ [`${fieldName}Error`]: false });
        } else {
            this.setState({ [`${fieldName}Error`]: !this.state[fieldName] });
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        const errors = {};
        const { deliveryChecked, paymentChecked, customerName, customerEmail, customerTel, customerAddress, customerComment } = this.state;
        let isFormValid = true;

        compose(
            each((input) => {
                errors[`${input.name}Error`] = !this.state[input.name];

                if (!this.state[input.name] && input.name !== 'customerAddress') {
                    isFormValid = false;
                }

                if (input.type === 'tel' && this.state[input.name].length < 10) {
                    errors[`${input.name}Error`] = true;
                }

                if (input.name === 'customerAddress') {
                    if (deliveryChecked.id !== 'pickup' && !this.state[input.name]) {
                        errors[`${input.name}Error`] = true;
                        isFormValid = false;
                    } else {
                        errors[`${input.name}Error`] = false;
                    }
                }
            }),
            filter(item => item.required)
        )(customerInfo);

        this.setState(errors);

        if (!isFormValid) {
            this.requiredFieldsStart.current.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        this.props.saveOrder({
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerTel,
                address: customerAddress,
                comment: customerComment
            },
            delivery: deliveryChecked,
            payment: paymentChecked
        })
            .then(({ shortId }) => {
                this.setState({ orderId: shortId });
            });
    };

    render () {
        const { langMap, lang, basket, langRoute } = this.props;

        const { deliveryChecked, paymentChecked, orderId } = this.state;
        const comment = find(item => item.name === 'customerComment', customerInfo);
        const text = propOr('checkoutPage', {}, langMap);
        const productsPrice = basket.reduce((sum, { quantity, product, properties }) => {
            const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
            const color = size.colors.find(color => color.id === properties.size.color.id);

            return sum + (quantity * color.discountPrice || quantity * color.price);
        }, 0);
        const totalPrice = productsPrice + (deliveryChecked.price || 0);

        if (!basket.length) {
            return <section className={styles.noItemsContainerWrap}>
                <Breadcrumbs noCategoryPage={text.checkout} />
                <div className={styles.noItemsContainer}>
                    <div className={styles.noItemsText}>
                        {text.noItemsInBasket}
                    </div>
                    <Link to={`${langRoute}`} className={styles.noItemsTextLink}>
                        <button className={styles.noItemsTextButton} type="submit">{text.toMain}</button>
                    </Link>
                </div>
            </section>;
        }

        return (<section className={styles.checkoutPage}>
            <Breadcrumbs noCategoryPage={text.checkout} />
            <form className={styles.content} onSubmit={this.handleSubmit}>
                <div className={styles.contentTop}>
                    <div className={styles.details}>
                        <h3 className={styles.h2}>{text.details}</h3>
                        <div className={styles.products}>
                            {basket.map(({ properties, quantity, product, id: basketItemId }, i) =>
                                <CartProduct
                                    product={product}
                                    quantity={quantity}
                                    properties={properties}
                                    basketItemId={basketItemId}
                                    newClass='orderItem'
                                    key={i} />
                            )}
                        </div>
                        <div className={styles.priceWrap}>
                            <p className={styles.priceRow}>{text.productPrice} <span>{formatMoney(productsPrice)}</span></p>
                            {deliveryChecked.price && <p className={styles.priceRow}>{text.deliveryPrice} <span>{formatMoney(deliveryChecked.price)}</span></p>}
                            <p className={styles.priceTotal}>{text.allPrice} <span>{formatMoney(totalPrice)}</span></p>
                        </div>
                    </div>
                    <div className={styles.checkout} ref={this.requiredFieldsStart}>
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
                                            checked={deliveryChecked.id === item.id}
                                            value={item.id}
                                            onChange={this.handleDeliveryChange}
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
                                            checked={paymentChecked.id === item.id}
                                            value={item.id}
                                            onChange={this.handlePaymentChange}
                                        />
                                        <div className={styles.radioContent}>
                                            <span className={styles.radioCheckmark} />
                                            {item.texts[lang].option}
                                            {item.texts[lang].description &&
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
                        <p className={styles.priceRow}>{text.productPrice} <span>{formatMoney(productsPrice)}</span></p>
                        {deliveryChecked.price && <p className={styles.priceRow}>{text.deliveryPrice} <span>{formatMoney(deliveryChecked.price)}</span></p>}
                        <p className={styles.priceTotal}>{text.allPrice} <span>{formatMoney(totalPrice)}</span></p>
                    </div>
                </div>
                <button type="submit" className={styles.buttonSubmit}>{text.btnConfirm}</button>
            </form>
            {orderId && <PopupOrder delivery={deliveryChecked} payment={paymentChecked} price={totalPrice} orderId={orderId} />}
        </section>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPage);

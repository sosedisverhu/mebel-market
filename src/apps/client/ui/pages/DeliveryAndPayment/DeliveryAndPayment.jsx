import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import DeliveryOffer from '../../components/DeliveryOffer/DeliveryOffer.jsx';
import styles from './DeliveryAndPayment.css';
import classNames from 'classnames';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class DeliveryAndPayment extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    state = {
        animation: false
    };

    componentDidMount () {
        setTimeout(() => {
            this.setState({ animation: true });
        }, 0);
    }

    render () {
        const { langMap } = this.props;
        const { animation } = this.state;
        const text = propOr('deliveryAndPayment', {}, langMap);

        return (
            <section className={styles.deliveryAndPayment}>
                <Breadcrumbs noCategoryPage={text.title}/>
                <DeliveryOffer mobile/>
                <div className={classNames(styles.deliveryAndPaymentContainer, {
                    [styles.animated]: animation
                })}>
                    <div className={styles.content}>
                        <h1 className={styles.title}>{text.title}</h1>
                        <div className={styles.options}>
                            <div className={styles.delivery}>
                                <h2 className={styles.optionsTitle}>{text.deliveryTitle}</h2>
                                <ul>
                                    {text.deliveryOptions.map((option, i) =>
                                        <li className={styles.option} key={i}>{option.text}</li>
                                    )}
                                </ul>
                            </div>
                            <div className={styles.payment}>
                                <h2 className={styles.optionsTitle}>{text.paymentTitle}</h2>
                                <ul>
                                    {text.paymentOptions.map((option, i) =>
                                        <li className={styles.option} key={i}>{option.text}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect(mapStateToProps)(DeliveryAndPayment);

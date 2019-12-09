import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import styles from './DeliveryAndPayment.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class DeliveryAndPayment extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('deliveryAndPayment', {}, langMap);

        return (
            <section className={styles.deliveryAndPayment}>
                <Breadcrumbs />
                <div className={styles.deliveryAndPaymentContainer}>
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

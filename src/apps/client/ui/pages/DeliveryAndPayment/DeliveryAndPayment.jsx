import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './DeliveryAndPayment.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        lang: application.lang
    };
};

class DeliveryAndPayment extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired
    };

    render () {
        const { langMap, lang } = this.props;
        const text = propOr('deliveryAndPayment', {}, langMap);

        return (
            <section className={styles.deliveryAndPayment}>
                <h1 className={styles.title}>{text.title}</h1>
                <div className={styles.options}>
                    <div className={styles.delivery}>
                        <h2 className={styles.optionsTitle}>{text.deliveryTitle}</h2>
                        <ul>
                            {text.deliveryOptions.map(option =>
                                <li className={styles.option}>{option.option}</li>
                            )}
                        </ul>
                    </div>
                    <div className={styles.payment}>
                        <h2 className={styles.optionsTitle}>{text.paymentTitle}</h2>
                        <ul>
                            {text.paymentOptions.map(option =>
                                <li className={styles.option}>{option.option}</li>
                            )}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect(mapStateToProps)(DeliveryAndPayment);

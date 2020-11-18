import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './DeliveryOffer.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap
    };
};

class DeliveryOffer extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        mobile: PropTypes.bool.isRequired
    };

    static defaultProps = {
        mobile: false
    };

    render () {
        const { mobile, langMap } = this.props;
        const text = propOr('deliveryOffer', {}, langMap);

        return (
            <div className={mobile ? styles.deliveryContainerMobile : styles.deliveryContainer}>
                <div className={styles.deliveryIcon}>
                    <img src="/src/apps/client/ui/components/DeliveryOffer/img/truckDelivery.svg" alt="truck"/>
                </div>
                <div className={styles.deliveryTextContent}>
                    <div className={styles.deliveryText}>{text.freeDelivery}</div>
                    <div className={styles.deliverySum}>{text.startingFrom}</div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps)(DeliveryOffer);

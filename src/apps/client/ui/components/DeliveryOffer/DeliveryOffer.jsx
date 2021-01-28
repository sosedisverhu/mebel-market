import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './DeliveryOffer.css';
import classNames from 'classnames';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap
    };
};

class DeliveryOffer extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        mobile: PropTypes.bool.isRequired,
        deliveryAnimation: PropTypes.bool
    };

    static defaultProps = {
        mobile: false
    };

    state = {
        deliveryAnimation: false
    };

    componentWillReceiveProps (nextProps, nextContext) {
        if (this.props.deliveryAnimation !== nextProps.deliveryAnimation) {
            this.setState({ deliveryAnimation: nextProps.deliveryAnimation });
        }
    }

    render () {
        const { mobile, langMap } = this.props;
        const { deliveryAnimation } = this.state;
        const text = propOr('deliveryOffer', {}, langMap);

        return (
            <div className={classNames(mobile ? styles.deliveryContainerMobile : styles.deliveryContainer, {
                [styles.animated]: mobile && deliveryAnimation
            })}>
                <div className={styles.deliveryIcon}>
                    <img src="/src/apps/client/ui/components/DeliveryOffer/img/truckDelivery.svg" alt="truck"/>
                </div>
                <div className={styles.deliveryTextContent}>
                    <div className={styles.deliveryText}>{text.specialOffer1}</div>
                    <div className={styles.deliverySum}>{text.specialOffer2}</div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps)(DeliveryOffer);

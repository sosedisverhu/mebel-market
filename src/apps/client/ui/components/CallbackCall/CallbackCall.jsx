import React, { Component } from 'react';

import CallbackForm from '../CallbackForm/CallbackForm';

import classNames from 'classnames';

import styles from './CallbackCall.css';

class CallbackCall extends Component {

    state = {
        isPopupCall: false
    };

    closePopup = () => () => {
        this.setState((state) => ({ isPopupCall: !state.isPopupCall }));
    };

    handleClick = () => {
        this.setState((state) => ({ isPopupCall: !state.isPopupCall }));
    }

    render () {
        const { isPopupCall } = this.state;

        return (<div>
            <div className={classNames(styles.phoneIcon, {[styles.disablePhoneIcon]: this.state.isPopupCall })} onClick={this.handleClick}>
                <div className={styles.imgWrap}>
                <svg className={styles.phone} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.8335 15.3537C20.3045 16.1712 21.7764 16.9887 23.2475 17.8063C23.8808 18.1578 24.1584 18.9039 23.9092 19.5842C22.6435 23.0419 18.9366 24.8669 15.4489 23.594C8.30699 20.9871 3.0129 15.693 0.406039 8.55115C-0.866945 5.06343 0.958099 1.35651 4.41578 0.0908323C5.09611 -0.158406 5.8422 0.119247 6.19455 0.752492C7.01127 2.22357 7.82881 3.69546 8.64634 5.16653C9.02954 5.85661 8.93942 6.67577 8.41496 7.26517C7.72814 8.03806 7.04131 8.81094 6.35448 9.58301C7.82069 13.1535 10.8465 16.1793 14.417 17.6455C15.1891 16.9587 15.9619 16.2719 16.7348 15.585C17.325 15.0606 18.1434 14.9705 18.8335 15.3537Z" fill="white"/>
                </svg>
                </div>
            </div>
            {isPopupCall && <CallbackForm closePopup = {this.closePopup} />}
        </div>
        );
    }
}

export default CallbackCall;

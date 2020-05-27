import React, { Component } from 'react';
import CallbackForm from '../CallbackForm/CallbackForm';

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
            <div className={styles.phoneIcon} onClick={this.handleClick}></div>
            {isPopupCall && <CallbackForm closePopup = {this.closePopup} />}
        </div>
        );
    }
}

export default CallbackCall;

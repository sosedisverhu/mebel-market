import React, { Component } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import styles from './CallbackForm.css';

class CallbackForm extends Component {
    constructor (props) {
        super(props);
    }

    popup = React.createRef();

    componentDidMount () {
        disableBodyScroll(this.popup.current);
    }

    componentWillUnmount () {
        clearAllBodyScrollLocks();
    }

    render () {
        return (
            <div className={styles.root}>
                <div className={styles.cover} onClick={this.props.closePopup()} />
                <div className={styles.popupWrap}>
                    <div className={styles.popup}>
                        <div className={styles.popupContent} ref={this.popup} >
                            <div>FORM</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CallbackForm;

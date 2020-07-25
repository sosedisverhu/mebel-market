import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import classNames from 'classnames';

import styles from './CallbackForm.css';

class CallbackForm extends Component {
    static propTypes = {
        text: PropTypes.object.isRequired,
        closePopup: PropTypes.func.isRequired,
        sendCallApplication: PropTypes.func.isRequired
    };

    state = {
        name: '',
        phone: '',
        error: false,
        successfulSubmit: false
    };

    popup = React.createRef();

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.successfulSubmit) {
            return;
        }

        let isFormValid = true;
        if (this.state.phone === '') {
            isFormValid = false;
            this.setState({
                error: true
            });
        }
        if (!isFormValid) {
            return;
        }
        this.setState({
            successfulSubmit: true
        });
        this.props.sendCallApplication({
            phone: this.state.phone || '',
            name: this.state.name || ''
        });
    };

    handleNameChange = (e) => {
        const name = e.target.value;
        this.setState({
            name,
            successfulSubmit: false
        });
    };

    handlePhoneChange = (e) => {
        const phone = e.target.value;
        this.setState({
            phone,
            error: false,
            successfulSubmit: false
        });
    };

    componentDidMount () {
        disableBodyScroll(this.popup.current);
    }

    componentWillUnmount () {
        clearAllBodyScrollLocks();
    }

    render () {
        const { text } = this.props;

        return (
            <div className={styles.root}>
                <div className={styles.cover} onClick={this.props.closePopup()} />
                <div className={styles.popupWrap}>
                    <div className={styles.popup}>
                        <div className={styles.popupContent} ref={this.popup} >
                            <div className={styles.escape} onClick={this.props.closePopup()}>
                                <img src='/src/apps/client/ui/components/CallbackForm/img/escape.svg' alt="icon" />
                            </div>
                            <div className={styles.userInfo}>
                                <h1 className={styles.title}>{text.title}</h1>
                                <div className={styles.dataField}>
                                    <form className={styles.form } onSubmit={this.handleSubmit}>
                                        <input onChange={this.handleNameChange} type="text" name="name" autoComplete="off" required />
                                        <label htmlFor="name" className={styles.labelName}>
                                            <span className={styles.contentName}>{text.firstField}</span>
                                        </label>

                                        <input onChange={this.handlePhoneChange} type="text" name="phone" autoComplete="off" required />
                                        <label htmlFor="phone" className={classNames(styles.labelPhone, { [styles.errorBorder]: this.state.error })}>
                                            <span className={styles.contentName}>{text.secondField}</span>
                                        </label>
                                        {this.state.error && <div className={styles.errorMessage}>{text.validationText}</div>}
                                        {!this.state.successfulSubmit && <button type="submit" formNoValidate="formnovalidate" className={styles.submit}>
                                            {text.btnConfirm}
                                        </button>}
                                        {this.state.successfulSubmit && <button formNoValidate="formnovalidate" className={styles.successfulSubmit}>
                                            <img src='/src/apps/client/ui/components/CallbackForm/img/tik.png' alt="button"/>
                                        </button>}
                                    </form>
                                </div>
                            </div>
                            <div className={styles.reference}>
                                <div className={styles.referenceInfo}>
                                    <div className={styles.line} />
                                    <div className={styles.referenceText}>
                                        {text.text}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CallbackForm;

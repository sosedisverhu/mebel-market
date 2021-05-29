import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import { connect } from 'react-redux';
import propOr from '@tinkoff/utils/object/propOr';

import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import sendCustomSizeApplication from '../../../services/client/sendCustomSizeApplication';

import classNames from 'classnames';

import styles from './CustomSizePopup.css';
import { MAX_PHONE_LENGTH } from '../../../constants/constants';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        lang: application.lang
    };
};

const mapDispatchToProps = dispatch => ({
    sendCustomSizeApplication: payload => dispatch(sendCustomSizeApplication(payload))
});

class CustomSizePopup extends Component {
    static propTypes = {
        closePopup: PropTypes.func.isRequired,
        sendCustomSizeApplication: PropTypes.func.isRequired,
        langMap: PropTypes.object.isRequired
    };

    state = {
        name: '',
        phone: '',
        email: '',
        width: 0,
        height: 0,
        agreement: false,
        phoneInvalid: false,
        emailInvalid: false,
        agreementInvalid: false,
        successfulSubmit: false
    };

    popup = React.createRef();

    validatePhone = (value) => {
        if (value === '' || value.length - value.replace(/\d/gm, '').length !== MAX_PHONE_LENGTH) {
            this.setState({
                phoneInvalid: true
            });
            return true;
        }
    }

    validateEmail = (value) => {
        const pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-line no-control-regex, no-useless-escape, max-len

        if (value === '' || !pattern.test(value)) {
            this.setState({
                emailInvalid: true
            });
            return true;
        }
    }

    validateCheckbox = (value) => {
        if (!value) {
            this.setState({
                agreementInvalid: true
            });
            return true;
        }
    }

    handleSubmit = (e) => {
        const { phone, name, agreement, email, width, height, successfulSubmit } = this.state;
        e.preventDefault();

        if (successfulSubmit) {
            return;
        }

        let isFormValid = true;
        if (this.validatePhone(phone) || this.validateEmail(email) || this.validateCheckbox(agreement)) {
            isFormValid = false;
        }
        if (!isFormValid) {
            return;
        }
        this.setState({
            successfulSubmit: true
        });
        this.props.sendCustomSizeApplication({
            phone: phone,
            name: name,
            email: email,
            width: width,
            height: height
        });
    };

    handleNameChange = (e) => {
        const name = e.target.value;
        this.setState({
            name,
            successfulSubmit: false
        });
    };

    handleCheckboxChange = (e) => {
        const property = e.target.checked;
        const name = e.target.name;
        this.setState({
            [name]: property,
            [name + 'Invalid']: false,
            successfulSubmit: false
        });
    };

    handleSizeChange = (e) => {
        const property = e.target.value;
        const name = e.target.name;
        this.setState({
            [name]: property
        });
    }

    handleInputChange = (e) => {
        const property = e.target.value;
        const name = e.target.name;
        this.setState({
            [name]: property,
            [name + 'Invalid']: false,
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
        const { langMap } = this.props;
        const { emailInvalid, phoneInvalid, agreementInvalid } = this.state;
        const text = propOr('customSize', {}, langMap);

        return (
            <div className={styles.root}>
                <div className={styles.cover} onClick={this.props.closePopup()}/>
                <div className={styles.popupWrap}>
                    <div className={styles.popup}>
                        <div className={styles.popupContent} ref={this.popup} >
                            <div className={styles.escape} onClick={this.props.closePopup()}>
                                <img src='/src/apps/client/ui/components/CustomSizePopup/img/escape.svg' alt="icon" />
                            </div>
                            <div className={styles.userInfo}>
                                <h1 className={styles.title}>{text.title}</h1>
                                <div className={styles.dataField}>
                                    <form className={styles.form} onSubmit={this.handleSubmit}>
                                        <p className={styles.subtitle}>{text.subTitle}</p>
                                        <div className={styles.size}>
                                            <div className={styles.sizeInput}>
                                                <input type="number" name="width" autoComplete="off" required onChange={this.handleInputChange}/>
                                                <label htmlFor="width" >
                                                    <span >{text.width}</span>
                                                </label>
                                            </div>
                                            <div className={styles.sizeInput}>
                                                <input type="number" name="height" autoComplete="off" required onChange={this.handleInputChange}/>
                                                <label htmlFor="height" >
                                                    {text.height}
                                                </label>
                                            </div>
                                        </div>
                                        <p className={styles.description}>
                                            {text.description}
                                        </p>
                                        <div className={styles.inputBlock}>
                                            <input type="text" name="name" autoComplete="off" required onChange={this.handleNameChange}/>
                                            <label htmlFor="name" className={styles.labelName}>
                                                <span className={styles.contentName}>{text.inputs.name}</span>
                                            </label>
                                        </div>
                                        <div className={styles.inputBlock}>
                                            <input type="text" name="email" autoComplete="off" required onChange={this.handleInputChange}/>
                                            <label htmlFor="email" className={classNames(styles.labelName, { [styles.invalidField]: emailInvalid })}>
                                                <span className={styles.contentName}>{text.inputs.mail}</span>
                                            </label>
                                        </div>
                                        <div className={styles.inputBlock}>
                                            <InputMask mask="+38 (999)-999-99-99" onChange={this.handleInputChange}>
                                                {(inputProps) => <input
                                                    {...inputProps}
                                                    name="phone"
                                                    placeholder="+38 (___)-___-__-__"
                                                    type="text"
                                                    autoComplete='off'
                                                />}
                                            </InputMask>
                                            <label htmlFor="phone" className={classNames(styles.labelPhone, { [styles.invalidField]: phoneInvalid })}>
                                                <span className={styles.contentName}>{text.inputs.phone}</span>
                                            </label>
                                        </div>
                                        <div className={styles.agreement}>
                                            <label className={styles.container}>
                                                <p>{text.agreement}</p>
                                                <input type="checkbox" name="agreement" onChange={this.handleCheckboxChange}/>
                                                <span className={classNames(styles.checkmark, { [styles.checkboxInvalid]: agreementInvalid })}></span>
                                            </label>
                                        </div>
                                        {!this.state.successfulSubmit && <button type="submit" formNoValidate="formnovalidate" className={styles.submit}>
                                            {text.order}
                                        </button>}
                                        {this.state.successfulSubmit && <button formNoValidate="formnovalidate" className={styles.successfulSubmit}>
                                            <img src='/src/apps/client/ui/components/CallbackForm/img/tik.png' alt="button" />
                                        </button>}
                                    </form>
                                </div>
                            </div>
                            <div className={styles.sideImg}>
                                <img src='/src/apps/client/ui/components/CustomSizePopup/img/couch.png' alt="couch"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomSizePopup);

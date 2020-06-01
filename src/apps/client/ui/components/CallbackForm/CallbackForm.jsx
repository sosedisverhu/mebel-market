import React, { Component } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import escape from 'src/apps/client/ui/components/CallbackForm/img/escape.svg';
import tik from 'src/apps/client/ui/components/CallbackForm/img/tik.png';
import classNames from 'classnames';

import styles from './CallbackForm.css';

class CallbackForm extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        name: '',
        phone: '',
        error: false,
        successfulSubmit: false
    }

    popup = React.createRef();

    handleSubmit = (e) => {
        e.preventDefault();
        let isFormValid = true;
        if (this.state.phone === '') {
            isFormValid = false;
            this.setState({
                error: true,
            })
        }
        if (!isFormValid) {
            return;
        }
        this.setState({
            successfulSubmit: true
        });
    }

    handleNameChange = (e) => {
        const name = e.target.value
        this.setState({
            name,
            successfulSubmit: false
        });
    }
    handlePhoneChange = (e) => {
        const phone = e.target.value
        this.setState({
            phone,
            error: false,
            successfulSubmit: false
        });
    }

    componentDidMount() {
        disableBodyScroll(this.popup.current);
    }

    componentWillUnmount() {
        clearAllBodyScrollLocks();
    }

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.cover} onClick={this.props.closePopup()} />
                <div className={styles.popupWrap}>
                    <div className={styles.popup}>
                        <div className={styles.popupContent} ref={this.popup} >
                            <div className={styles.escape} onClick={this.props.closePopup()}>
                                <img src={escape} alt="icon" />
                            </div>
                            <div className={styles.userInfo}>
                                <h1 className={styles.title}>Связаться с нами</h1>
                                <div className={styles.dataField}>
                                    <form className={styles.form } onSubmit={this.handleSubmit}>
                                        <input onChange={this.handleNameChange} type="text" name="name" autoComplete="off" required />
                                        <label htmlFor="name" className={styles.labelName}>
                                            <span className={styles.contentName}>Имя</span>
                                        </label>

                                        <input onChange={this.handlePhoneChange} type="text" name="phone" autoComplete="off" required />
                                        <label htmlFor="phone" className={classNames(styles.labelPhone, {[styles.errorBorder]: this.state.error})}>
                                            <span className={styles.contentName}>Телефон</span>
                                        </label>
                                        {this.state.error && <div className={styles.errorMessage}>*Введите номер телефона</div>}
                                        {!this.state.successfulSubmit && <button type="submit" formNoValidate="formnovalidate" className={styles.submit}>Подтвердить</button>}
                                        {this.state.successfulSubmit && <button formNoValidate="formnovalidate" className={styles.successfulSubmit}>
                                            <img src={tik} alt="button"/>
                                        </button>}
                                    </form>
                                </div>
                            </div>
                            <div className={styles.reference}>
                                <div className={styles.referenceInfo}>
                                    <div className={styles.line}></div>
                                    <div className={styles.referenceText}>
                                        Lorem ipsum dolor sit amet.
                                        Illum sed veritatis perferendis dolorum?
                                        Voluptatem accusantium distinctio sit atque?
                                        Possimus velit animi dolores quibusdam.
                                        Ipsa eveniet inventore modi ratione?
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

import React, { Component } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import escape from 'src/apps/client/ui/components/CallbackForm/img/escape.svg';

import styles from './CallbackForm.css';

class CallbackForm extends Component {
    constructor(props) {
        super(props);
    }

    popup = React.createRef();

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
                                    <div className={styles.form}>
                                        <input type="text" name="name" autoComplete="off" required />
                                        <label htmlFor="name" className={styles.labelName}>
                                            <span className={styles.contentName}>Имя</span>
                                        </label>
                                    </div>
                                    <div className={styles.form}>
                                        <input type="text" name="phone" autoComplete="off" required />
                                        <label htmlFor="phone" className={styles.labelName}>
                                            <span className={styles.contentName}>Телефон</span>
                                        </label>
                                    </div>
                                    <button>Подтвердить</button>
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

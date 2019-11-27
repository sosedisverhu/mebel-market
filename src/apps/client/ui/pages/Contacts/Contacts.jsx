import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Contacts.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Contacts extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('contacts', {}, langMap);

        return (
            <section className={styles.contacts}>
                <h1 className={styles.title}>{text.title}</h1>
                <div className={styles.info}>
                    <div className={styles.phonesContainer}>
                        <h2 className={styles.infoTitle}>{text.phonesTitle}</h2>
                        <a className={styles.infoText} href="tel:+380443557720">(044) 355-77-20</a>
                        <a className={styles.infoText} href="tel:+380500511000">(050) 051-10-00</a>
                        <a className={styles.infoText} href="tel:+380679000522">(067) 900-05-22</a>
                    </div>
                    <div className={styles.emailScheduleContainer}>
                        <div className={styles.emailContainer}>
                            <h2 className={styles.infoTitle}>{text.emailTitle}</h2>
                            <a className={styles.infoText} href="mailto:mebelmarket@gmail.com">mebelmarket@gmail.com</a>
                        </div>
                        <div className={styles.scheduleContainer}>
                            <h2 className={styles.infoTitle}>{text.scheduleTitle}</h2>
                            <p className={styles.infoText}>{text.scheduleDays} 10:00 - 19:00</p>
                        </div>
                    </div>
                    <div className={styles.addressContainer}>
                        <h2 className={styles.infoTitle}>{text.addressTitle}</h2>
                        <p className={styles.infoText}>{text.addressText}</p>
                    </div>
                </div>
                <div className={styles.map}>
                </div>
            </section>
        );
    }
}

export default connect(mapStateToProps)(Contacts);

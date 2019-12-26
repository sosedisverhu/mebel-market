import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Footer.css';

class Footer extends Component {
    render () {
        return (
            <div className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.iconsWrapper}>
                        <a href="#" target="_blank"  className={styles.instagramLink}>
                            <div className={styles.instagram}/>
                        </a>
                        <a href="#" target="_blank" className={styles.facebookLink}>
                            <div className={styles.facebook}/>
                        </a>
                        <a href="#" target="_blank">
                            <div className={styles.youtube}/>
                        </a>
                    </div>
                    <div className={styles.developedWrapper}>
                        Developed by
                        <a
                            className={styles.stubbsText}
                            href="https://stubbs.pro/?utm_source=prev_clients&utm_campaign=mebelmarket"
                            target="_blank"
                        >
                            Stubbs
                        </a>
                    </div>
                    <div className={styles.contactsWrapper}>
                        <div className={styles.contactsLinkWrapperTop}>
                            <a className={styles.contactsLink} href="tel:+380443557720">(044) 355-77-20</a>
                            <a className={styles.contactsLink} href="tel:+380500511000">(050) 051-10-00</a>
                        </div>
                        <div className={styles.contactsLinkWrapperBottom}>
                            <a className={styles.contactsLink} href="mailto:mebelmarket@gmail.com">mebelmarket@gmail.com</a>
                            <a className={styles.contactsLink} href="tel:+380679000522">(067) 900-05-22</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Footer);

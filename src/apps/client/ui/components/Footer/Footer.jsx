import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Footer.css';

class Footer extends Component {
    render () {
        return (
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.iconsWrapper}>
                        <a href="https://www.instagram.com/mebelmarket.ua/" target="_blank" className={styles.instagramLink}>
                            <div className={styles.instagram}>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* eslint-disable-next-line max-len */}
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 18C0 8.07472 8.07472 0 18 0C27.9253 0 36 8.07472 36 18C36 27.9253 27.9253 36 18 36C8.07472 36 0 27.9253 0 18ZM2.29787 18C2.29787 26.6582 9.34177 33.7021 18 33.7021C26.6582 33.7021 33.7021 26.6582 33.7021 18C33.7021 9.34177 26.6582 2.29787 18 2.29787C9.34177 2.29787 2.29787 9.34177 2.29787 18Z" fill="#232323"/>
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M22.4806 8H13.5192C10.4759 8 8 10.476 8 13.5193V22.4807C8 25.5241 10.4759 28 13.5192 28H22.4806C25.5241 28 28 25.524 28 22.4807V13.5193C28.0001 10.476 25.5241 8 22.4806 8ZM26.2256 22.4807C26.2256 24.5456 24.5456 26.2255 22.4807 26.2255H13.5192C11.4544 26.2256 9.7745 24.5456 9.7745 22.4807V13.5193C9.7745 11.4545 11.4544 9.7745 13.5192 9.7745H22.4806C24.5455 9.7745 26.2255 11.4545 26.2255 13.5193V22.4807H26.2256Z" fill="#232323"/>
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M18.0002 12.8467C15.1585 12.8467 12.8467 15.1586 12.8467 18.0002C12.8467 20.8418 15.1585 23.1535 18.0002 23.1535C20.8419 23.1535 23.1537 20.8418 23.1537 18.0002C23.1537 15.1586 20.8419 12.8467 18.0002 12.8467ZM18.0002 21.3789C16.1371 21.3789 14.6212 19.8632 14.6212 18.0001C14.6212 16.1369 16.137 14.6211 18.0002 14.6211C19.8634 14.6211 21.3792 16.1369 21.3792 18.0001C21.3792 19.8632 19.8633 21.3789 18.0002 21.3789Z" fill="#232323"/>
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M23.3697 11.342C23.0278 11.342 22.6919 11.4805 22.4505 11.723C22.2078 11.9643 22.0684 12.3003 22.0684 12.6433C22.0684 12.9853 22.208 13.3212 22.4505 13.5637C22.6918 13.805 23.0278 13.9446 23.3697 13.9446C23.7127 13.9446 24.0475 13.805 24.29 13.5637C24.5325 13.3212 24.6709 12.9852 24.6709 12.6433C24.6709 12.3003 24.5325 11.9643 24.29 11.723C24.0487 11.4805 23.7127 11.342 23.3697 11.342Z" fill="#232323"/>
                                </svg>
                            </div>
                        </a>
                        <a href="https://www.facebook.com/mmebelmarket/" target="_blank" className={styles.facebookLink}>
                            <div className={styles.facebook}>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* eslint-disable-next-line max-len */}
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 18C0 8.07472 8.07472 0 18 0C27.9253 0 36 8.07472 36 18C36 27.9253 27.9253 36 18 36C8.07472 36 0 27.9253 0 18ZM2.29787 18C2.29787 26.6582 9.34177 33.7021 18 33.7021C26.6582 33.7021 33.7021 26.6582 33.7021 18C33.7021 9.34177 26.6582 2.29787 18 2.29787C9.34177 2.29787 2.29787 9.34177 2.29787 18Z" fill="black"/>
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M21.2463 11.448C19.9823 11.448 19.3503 12.136 19.3503 13.512V14.28H22.8783V16.68H19.4463V27H16.4463V16.68H14.3343V14.28H16.4463V13.464C16.4463 12.088 16.8463 11.008 17.6463 10.224C18.4463 9.424 19.5743 9.024 21.0303 9.024C22.1823 9.024 23.0863 9.256 23.7423 9.72L22.9023 11.976C22.3903 11.624 21.8383 11.448 21.2463 11.448Z" fill="black"/>
                                </svg>
                            </div>
                        </a>
                        <a href="https://www.youtube.com/channel/UComiyZA3-1qXTnArdGyeF1g" target="_blank">
                            <div className={styles.youtube}>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* eslint-disable-next-line max-len */}
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 18C0 8.07472 8.07472 0 18 0C27.9253 0 36 8.07472 36 18C36 27.9253 27.9253 36 18 36C8.07472 36 0 27.9253 0 18ZM2.29787 18C2.29787 26.6582 9.34177 33.7021 18 33.7021C26.6582 33.7021 33.7021 26.6582 33.7021 18C33.7021 9.34177 26.6582 2.29787 18 2.29787C9.34177 2.29787 2.29787 9.34177 2.29787 18Z" fill="#232323"/>
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M24.6154 11H11.3846C9.51534 11 8 12.5153 8 14.3846V21.4615C8 23.3308 9.51534 24.8462 11.3846 24.8462H24.6154C26.4847 24.8462 28 23.3308 28 21.4615V14.3846C28 12.5153 26.4847 11 24.6154 11Z" stroke="#232323" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                                    {/* eslint-disable-next-line max-len */}
                                    <path d="M20.7693 17.3754C20.8701 17.427 20.9547 17.5055 21.0137 17.6021C21.0728 17.6987 21.1041 17.8098 21.1041 17.9231C21.1041 18.0363 21.0728 18.1474 21.0137 18.244C20.9547 18.3407 20.8701 18.4191 20.7693 18.4708L18.8462 19.4615L16.7416 20.5415C16.648 20.5893 16.5438 20.6124 16.4388 20.6085C16.3338 20.6046 16.2315 20.5739 16.1418 20.5193C16.052 20.4647 15.9777 20.388 15.926 20.2966C15.8742 20.2051 15.8468 20.102 15.8462 19.9969V15.8492C15.8462 15.7439 15.8733 15.6403 15.9249 15.5485C15.9764 15.4566 16.0506 15.3795 16.1405 15.3246C16.2303 15.2696 16.3328 15.2386 16.438 15.2346C16.5433 15.2305 16.6478 15.2536 16.7416 15.3015L18.8462 16.3846L20.7693 17.3754Z" fill="#232323"/>
                                </svg>
                            </div>
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
                        </div>
                        <div className={styles.contactsLinkWrapperBottom}>
                            <a className={styles.contactsLink} href="mailto:mebelmarket@gmail.com">mebelmarket@gmail.com</a>
                            <a className={styles.contactsLink} href="tel:+380679000522">(067) 900-05-22</a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default connect()(Footer);

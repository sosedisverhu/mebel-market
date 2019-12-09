import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import styles from './Partners.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        partners: data.partners
    };
};

class Partners extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        partners: PropTypes.array
    };

    render () {
        const { langMap, lang, partners } = this.props;
        const text = propOr('partners', {}, langMap);
console.log(partners)
        return (
            <section className={styles.partners}>
                <Breadcrumbs />
                <div className={styles.partnersContainer}>
                    <div className={styles.content}>
                        <h1 className={styles.title}>{text.title}</h1>
                        <div className={styles.partnersWrapper}>
                            {/*{partners.map((partner, i) =>
                                <div className={styles.partnerItem} key={i}>
                                    <h2 className={styles.partnerName}>{partner.texts[lang].name}</h2>
                                    <div className={styles.partnerLogoWrapper}>
                                        <img className={styles.partnerLogo} src={partner.url} alt={partner.alt}/>
                                    </div>
                                    <p className={styles.partnerText}>{partner.texts[lang].text}</p>
                                </div>
                            )}*/}
                            {partners.map((partner, i) =>
                                <div className={styles.partnerItem} key={i}>
                                    <h2 className={styles.partnerName}>{partner.texts[lang].name}</h2>
                                    <div dangerouslySetInnerHTML={{ __html: partner.texts[lang].content.replace(/\\/g, '') }}/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect(mapStateToProps)(Partners);

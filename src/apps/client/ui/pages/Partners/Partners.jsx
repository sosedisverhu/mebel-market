import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import styles from './Partners.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Partners extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('partners', {}, langMap);

        return (
            <section className={styles.partners}>
                <Breadcrumbs />
                <div className={styles.partnersContainer}>
                    <div className={styles.content}>
                        <h1 className={styles.title}>{text.title}</h1>
                        <div className={styles.partnersWrapper}>
                            {text.sections.map((partner, i) =>
                                <div className={styles.partnerItem} key={i}>
                                    <h2 className={styles.partnerName}>{partner.name}</h2>
                                    <div className={styles.partnerLogoWrapper}>
                                        <img className={styles.partnerLogo} src={partner.url} alt={partner.alt}/>
                                    </div>
                                    <p className={styles.partnerText}>{partner.text}</p>
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import propOr from '@tinkoff/utils/object/propOr';

import { connect } from 'react-redux';

import styles from './Advantages.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Advantages extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('mainPage', {}, langMap);

        return <div className={styles.root}>
            <div className={styles.contentWrap}>
                <div className={styles.content}>
                    <h2 className={styles.title}>{text.title}</h2>
                    <div className={styles.advantages}>
                        <div className={styles.advantage}>
                            <div className={styles.imgWrap}>
                                <img className={styles.img} src="src/apps/client/ui/components/Advantages/img/quality.png" width='80' height='80' alt=""/>
                            </div>
                            <h3 className={styles.advantageTitle}>{text.qualityTitle}</h3>
                            <p className={styles.advantageText}>{text.qualityText}</p>
                        </div>
                        <div className={styles.advantage}>
                            <div className={styles.imgWrap}>
                                <img className={styles.img} src="src/apps/client/ui/components/Advantages/img/price.png" width='80' height='80' alt=""/>
                            </div>
                            <h3 className={styles.advantageTitle}>{text.priceTitle}</h3>
                            <p className={styles.advantageText}>{text.priceText}</p>
                        </div>
                        <div className={styles.advantage}>
                            <div className={styles.imgWrap}>
                                <img className={styles.img} src="src/apps/client/ui/components/Advantages/img/delivery.png" width='80' height='80' alt=""/>
                            </div>
                            <h3 className={styles.advantageTitle}>{text.deliveryTitle}</h3>
                            <p className={styles.advantageText}>{text.deliveryText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(Advantages);

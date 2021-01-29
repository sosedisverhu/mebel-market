import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Advantages.css';
import classNames from 'classnames';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Advantages extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        advantagesAnimation: PropTypes.bool.isRequired
    };

    state = {
        advantagesAnimation: false
    };

    componentWillReceiveProps (nextProps, nextContext) {
        if (this.props.advantagesAnimation !== nextProps.advantagesAnimation) {
            this.setState({ advantagesAnimation: nextProps.advantagesAnimation });
        }
    }

    render () {
        const { langMap } = this.props;
        const { advantagesAnimation } = this.state;
        const text = propOr('mainPage', {}, langMap);

        return <div className={classNames(styles.root, {
            [styles.animated]: advantagesAnimation
        })}>
            <div className={styles.contentWrap}>
                <div className={styles.content}>
                    <h2 className={styles.title}>{text.title}</h2>
                    <div className={styles.advantages}>
                        <div className={styles.advantage}>
                            <div className={styles.imgWrap}>
                                <img
                                    className={styles.img} src="/src/apps/client/ui/components/Advantages/img/quality.svg"
                                    width='80'
                                    height='80'
                                    alt="quality"
                                />
                            </div>
                            <h3 className={styles.advantageTitle}>{text.qualityTitle}</h3>
                            <p className={styles.advantageText}>{text.qualityText}</p>
                        </div>
                        <div className={styles.advantage}>
                            <div className={styles.imgWrap}>
                                <img className={styles.img} src="/src/apps/client/ui/components/Advantages/img/price.svg" width='80' height='80' alt="price"/>
                            </div>
                            <h3 className={styles.advantageTitle}>{text.priceTitle}</h3>
                            <p className={styles.advantageText}>{text.priceText}</p>
                        </div>
                        <div className={styles.advantage}>
                            <div className={styles.imgWrap}>
                                <img
                                    className={styles.img} src="/src/apps/client/ui/components/Advantages/img/delivery.svg"
                                    width='80'
                                    height='80'
                                    alt="delivery"
                                />
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

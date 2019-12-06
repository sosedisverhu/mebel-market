import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import propOr from '@tinkoff/utils/object/propOr';

import styles from './Card.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        langRoute: application.langRoute
    };
};

class Card extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        product: PropTypes.object.isRequired,
        newClass: PropTypes.string,
        labelClass: PropTypes.string
    };

    getLabels = (labels, discountPrice) => {
        if (discountPrice) {
            return labels.map((label, index) => {
                return <div key={index} className={`${styles.label} ${styles.discount}`}>-{discountPrice} %</div>;
            });
        } else if (labels) {
            return labels.map((label, index) => {
                return label === 'top' &&
                    <div key={index} className={`${styles.label} ${styles.hit}`}>
                        {propOr('product', {}, this.props.langMap).labelTop}
                    </div>;
            });
        }
    };

    render () {
        const {
            product: { texts, labels, discountPrice, photos: [logo], basePrice, price },
            newClass,
            labelClass
        } = this.props;

        const lang = 'ru';

        return (
            <a className={classNames(
                styles.product,
                { [styles[newClass]]: newClass },
                { [styles[labelClass]]: labelClass }
            )}>
                <div className={styles.labels}>
                    {this.getLabels(labels, discountPrice)}
                </div>
                <div className={styles.imgWrap}>
                    <img className={styles.img} src={logo} alt="" />
                </div>
                <div className={styles.bottomPanel}>
                    <div className={styles.title}>{texts[lang].name}</div>
                    {discountPrice ? <div className={styles.priceOld}>{basePrice} &#8372;</div> : null}
                    <div className={styles.price}>{price} &#8372;</div>
                </div>
            </a>);
    }
}

export default connect(mapStateToProps)(Card);

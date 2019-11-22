import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './AboutProductTop.css';

class AboutProductTop extends Component {
    static propTypes = {
        newClass: PropTypes.string
    };

    render () {
        const { newClass } = this.props;

        return <div className={classNames(styles.root, { [styles[newClass]]: newClass })}>
            <h1 className={styles.name}>Кровать «Анталия»</h1>
            <div className={styles.warrantyArticleWrap}>
                <div className={styles.warranty}>Гарантия 12 мес.</div>
                <div className={styles.article}>артикул 48092</div>
            </div>
        </div>;
    }
}

export default connect()(AboutProductTop);

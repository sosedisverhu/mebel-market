import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './StyleRenderer.css';

export default class StyleRenderer extends Component {
    static propTypes = {
        html: PropTypes.string
    };

    static defaultProps = {
        html: ''
    };

    render () {
        return <span className={styles.style}>
            <div dangerouslySetInnerHTML={{ __html: this.props.html.replace(/\\/g, '') }}/>
        </span>;
    }
}

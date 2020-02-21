import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getInstagramTemplate from './utils/getInstagramTemplate';

import styles from './StyleRenderer.css';

export default class StyleRenderer extends Component {
    static propTypes = {
        html: PropTypes.string,
        newClass: PropTypes.string
    };

    static defaultProps = {
        html: ''
    };

    componentDidMount () {
        this.setInstagramPosts();
    }

    setInstagramPosts = () => {
        const object = document.querySelectorAll('oembed[url]');
        for (let element in object) {
            if (object.hasOwnProperty(element)) {
                const url = element.getAttribute('url');

                if (url.indexOf('https://www.instagram.com') === 0) {
                    element.innerHTML = getInstagramTemplate(url);
                }
            }
        }

        window.instgrm.Embeds.process();
    };

    render () {
        const { newClass, html } = this.props;

        return <div className={classNames(styles.style, { [styles[newClass]]: newClass })}>
            <div dangerouslySetInnerHTML={{ __html: html.replace(/\\/g, '') }}/>
        </div>;
    }
}

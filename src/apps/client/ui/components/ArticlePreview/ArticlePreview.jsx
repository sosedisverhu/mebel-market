import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import getDateFormatted from '../../../../../../utils/getDateFormatted';
import propOr from '@tinkoff/utils/object/propOr';

import styles from './ArticlePreview.css';

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
        article: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired
    };

    render () {
        const {
            article: { id, alias, texts, date },
            lang,
            langMap
        } = this.props;

        const text = propOr('article', {}, langMap);

        return (
            <div className={styles.article} key={id}>
                <Link className={styles.titleLink} to={`/articles/${alias}`}>
                    <h1 className={styles.title}><span className={styles.titleUnderline}>{texts[lang].name}</span></h1>
                </Link>
                <p>{texts[lang].preview}</p>
                <div className={styles.moreInfo}>
                    <Link to={`/articles/${alias}`}>
                        <button className={styles.readMoreBtn}>{text.moreBtn}</button>
                    </Link>
                    <span className={styles.date}>{getDateFormatted(date, lang) + ' ' + text.year}</span>
                </div>
            </div>);
    }
}

export default connect(mapStateToProps)(Card);

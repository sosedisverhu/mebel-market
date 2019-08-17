import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';

import { connect } from 'react-redux';
import setLang from '../../../actions/setLang';

import { LANGS } from '../../../constants/constants';

import styles from './MainPage.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        lang: application.lang
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setLang: payload => dispatch(setLang(payload))
    };
};

class MainPage extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        setLang: PropTypes.func.isRequired
    };

    handleLangClick = lang => () => {
        this.props.setLang(lang);
    };

    render () {
        const { langMap, lang } = this.props;
        const text = propOr('content', {}, langMap);

        return <section className={styles.root}>
            <div className={styles.title}>{text.title}</div>
            <div className={styles.langBlock}>
                <div className={styles.langsTitle}>{text.langs}</div>
                <div className={styles.langs}>
                    { LANGS.map((langItem, i) => <div
                        key={i}
                        onClick={this.handleLangClick(langItem)}
                        className={classNames(styles.lang, {
                            [styles.activeLang]: lang === langItem
                        })}
                    >
                        {langItem}
                    </div>) }
                </div>
            </div>
        </section>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);

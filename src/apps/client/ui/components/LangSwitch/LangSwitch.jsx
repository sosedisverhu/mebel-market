import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import outsideClick from '../../hocs/outsideClick.jsx';

import { LANGS } from '../../../constants/constants';
import setLang from '../../../actions/setLang';

import styles from './LangSwitch.css';

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setLang: payload => dispatch(setLang(payload))
    };
};

@outsideClick
class LangSwitch extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        setLang: PropTypes.func.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        additionalClass: PropTypes.string
    };

    constructor (props) {
        super(props);
        this.state = { active: false };
    }

    handleLangsClose = () => {
        this.setState({
            active: false
        });
    };

    handleLangClick = lang => () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;

        this.props.setLang(lang);
        this.setState(state => ({ ...state, active: !state.active }));

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleLangsClose);
        }
    };

    render () {
        const { lang, additionalClass } = this.props;
        const { active } = this.state;

        return (
            <div className={classNames(styles.langs,
                { [styles.active]: active },
                { [styles[additionalClass]]: additionalClass }
            )}>

                <div onClick={this.handleLangClick(lang)} className={classNames(styles.lang, styles.activeLang)}>
                    {lang}
                </div>

                <div className={styles.additionalLangs}>
                    {LANGS.filter(langItem => langItem !== lang).map((langItem, i) => {
                        return (
                            <div
                                key={i}
                                onClick={this.handleLangClick(langItem)}
                                className={styles.lang}
                            >
                                {langItem}
                            </div>
                        );
                    })}
                </div>
            </div>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LangSwitch);

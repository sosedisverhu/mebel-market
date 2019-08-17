import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import setLangMap from '../../../actions/setLangMap';
import setLangRoute from '../../../actions/setLangRoute';

import getLangRoute from '../../../utils/getLangRoute';

import { DEFAULT_LANG } from '../../../constants/constants';

import maps from './maps';

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang
    };
};

const mapDispatchToProps = (dispatch) => ({
    setLangMap: payload => dispatch(setLangMap(payload)),
    setLangRoute: payload => dispatch(setLangRoute(payload))
});

const lang = WrappedComponent => {
    class Lang extends PureComponent {
        static propTypes = {
            setLangMap: PropTypes.func.isRequired,
            setLangRoute: PropTypes.func.isRequired,
            lang: PropTypes.string
        };

        constructor (...args) {
            super(...args);

            const { lang } = this.props;
            const langMap = maps[lang] || maps[DEFAULT_LANG];

            this.setLangRoute(lang);
            this.props.setLangMap(langMap);
        }

        componentWillReceiveProps (nextProps) {
            if (nextProps.lang !== this.props.lang) {
                const langMap = maps[nextProps.lang];

                if (langMap) {
                    this.props.setLangMap(langMap);
                    this.setLangRoute(nextProps.lang);
                }
            }
        }

        setLangRoute = lang => {
            const langRoute = getLangRoute(lang);

            this.props.setLangRoute(langRoute);
        };

        render () {
            return <WrappedComponent
                {...this.props}
            />;
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(Lang);
};

export default lang;

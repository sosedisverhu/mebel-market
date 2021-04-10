import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';

import setScrollToCharacteristic from '../../../actions/setScrollToCharacteristic';
import StyleRenderer from '../StyleRenderer/StyleRenderer';
import Comments from '../Comments/Comments';

import { FEATURE_TYPES } from '../../../../admin/constants/constants';

import styles from './Tab.css';

const mapStateToProps = ({ data, application }) => {
    return {
        lang: application.lang,
        langMap: application.langMap,
        tabs: [
            {
                id: 'description'
            },
            {
                id: 'characteristic'
            },
            {
                id: 'features'
            },
            {
                id: 'comments'
            }
        ],
        scroll: data.scrollToCharacteristic
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setScrollToCharacteristic: payload => dispatch(setScrollToCharacteristic(payload))
    };
};

class Tab extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        tabs: PropTypes.array.isRequired,
        product: PropTypes.object.isRequired,
        scroll: PropTypes.bool.isRequired,
        setScrollToCharacteristic: PropTypes.func.isRequired,
        infoAnimation: PropTypes.bool
    };

    static defaultProps = {
        tabs: [],
        scroll: false,
        infoAnimation: true
    };

    constructor (props) {
        super(props);
        this.state = {
            activeId: this.props.tabs[0] && this.props.tabs[0].id,
            userName: '',
            userPhone: '',
            userComment: '',
            userMark: ''
        };
        this.tabTitles = React.createRef();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.scroll !== this.props.scroll && nextProps.scroll) {
            this.setState({ activeId: 'characteristic' }, () => {
                this.tabTitles.current.scrollIntoView({ behavior: 'smooth' });
                this.props.setScrollToCharacteristic(false);
            });
        }
    }

    handleChange (id) {
        this.setState({ activeId: id });
    }

    getContent () {
        const { product, lang } = this.props;

        switch (this.state.activeId) {
        case 'description': {
            return (
                <div className={styles.description}>
                    <StyleRenderer newClass='description' html={product.texts[lang].description}/>
                </div>);
        }
        case 'characteristic': {
            return (
                <div>
                    {product.characteristics[lang].characteristics.map((characteristic, i) => {
                        return (
                            <div className={styles.row} key={i}>
                                <h3 className={styles.characterTitle}>{characteristic.name}</h3>
                                <p className={styles.characterText}>{characteristic.value}</p>
                            </div>);
                    })}
                </div>);
        }
        case 'features': {
            return (
                <div>
                    <div className={styles.featuresContainer}>
                        {product.features && product.features[lang].features.map((feature) => {
                            return <div className={styles.featureBlock}>
                                <img src={FEATURE_TYPES[feature.featureType].photo} alt="icon"/>
                                <div className={styles.featureText}>
                                    <p className={styles.featureTitle}>
                                        {feature.name}
                                    </p>
                                    <p className={styles.featureDescription}>
                                        {feature.value}
                                    </p>
                                </div>
                            </div>;
                        })}
                    </div>

                </div>);
        }
        case 'comments': {
            return <Comments productId={product.id}/>;
        }
        }
    }

    render () {
        const { tabs, langMap, infoAnimation, product } = this.props;
        const { activeId } = this.state;
        const text = propOr('tab', {}, langMap);

        return <div className={classNames(styles.root, {
            [styles.animated]: infoAnimation
        })}>
            <div ref={this.tabTitles} className={styles.titles}>
                {tabs.map(({ id }) => {
                    if (id === 'features' && !product.features) {
                        return null;
                    }
                    return <h2
                        key={id}
                        className={classNames(styles.title, { [styles.active]: activeId === id })}
                        onClick={() => this.handleChange(id)}>
                        {text[id]}
                    </h2>;
                })}
            </div>
            <div className={styles.contentWrap}>
                <div className={classNames(styles.content, {
                    [styles.contentFull]: activeId === 'comments'
                })}>
                    {this.getContent()}
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tab);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';
import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';

import StyleRenderer from '../StyleRenderer/StyleRenderer';
import styles from './Tab.css';

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang,
        langMap: application.langMap
    };
};

class Tab extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        product: PropTypes.object.isRequired
    };

    state = {
        activeTab: {}
    };

    componentDidMount () {
        this.setState({
            activeTab: propOr('product', {}, this.props.langMap).tabs[0]
        });
    }

    getContent () {
        const { activeTab } = this.state;
        const { product, lang } = this.props;

        if (activeTab.id === '1') {
            return (
                <div className={styles.description}>
                    <StyleRenderer newClass='description' html={product.texts[lang].description}/>
                </div>);
        }

        return (
            <div>
                {product.characteristics[lang].characteristics.map(characteristic => {
                    return (
                        <div className={styles.row} key={characteristic.id}>
                            <h3 className={styles.characterTitle}>{characteristic.name}</h3>
                            <p className={styles.characterText}>{characteristic.value}</p>
                        </div>);
                })}
            </div>);
    }

    handleChange = id => {
        this.setState({
            activeTab: find(tab => tab.id === id, propOr('product', {}, this.props.langMap).tabs)
        });
    };

    render () {
        const { langMap } = this.props;
        const { activeTab } = this.state;
        const text = propOr('product', {}, langMap);

        return <div className={styles.root}>
            <div className={styles.titles}>
                {text.tabs.map(tab => {
                    return <h2
                        key={tab.id}
                        className={classNames(styles.title, { [styles.active]: activeTab.id === tab.id })}
                        onClick={() => this.handleChange(tab.id)}
                    >
                        {tab.name}
                    </h2>;
                })}
            </div>
            <div className={styles.contentWrap}>
                <div className={styles.content}>
                    {this.getContent()}
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(Tab);

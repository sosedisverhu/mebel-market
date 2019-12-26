import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import setScrollToCharacteristic from '../../../actions/setScrollToCharacteristic';
import StyleRenderer from '../StyleRenderer/StyleRenderer';
import Comments from '../Comments/Comments';

import styles from './Tab.css';

const mapStateToProps = ({ data, application }) => {
    return {
        lang: application.lang,
        tabs: [
            {
                id: 'description',
                title: 'Описание'
            },
            {
                id: 'characteristic',
                title: 'Характеристики'
            },
            {
                id: 'comments',
                title: 'Отзывы'
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
        tabs: PropTypes.array.isRequired,
        product: PropTypes.object.isRequired,
        scroll: PropTypes.bool.isRequired,
        setScrollToCharacteristic: PropTypes.func.isRequired
    };

    static defaultProps = {
        tabs: [],
        scroll: false
    };

    constructor (props) {
        super(props);
        this.state = {
            activeId: this.props.tabs[0] && this.props.tabs[0].id
        };
        this.tabTitles = React.createRef();
    }

    handleChange (id) {
        this.setState({ activeId: id });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.scroll !== this.props.scroll && nextProps.scroll) {
            this.setState({ activeId: 'characteristic' }, () => {
                this.tabTitles.current.scrollIntoView({ behavior: 'smooth' });
                this.props.setScrollToCharacteristic(false);
            });
        }
    }

    getContent () {
        const { activeId } = this.state;
        const { product, lang } = this.props;

        if (activeId === 'description') {
            return (
                <div className={styles.description}>
                    <StyleRenderer newClass='description' html={product.texts[lang].description}/>
                </div>);
        }

        if (activeId === 'comments') {
            return (
                <div>
                    <Comments />
                </div>
            )
        }

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

    render () {
        const { tabs } = this.props;
        const { activeId } = this.state;

        return <div className={styles.root}>
            <div ref={this.tabTitles} className={styles.titles}>
                {tabs.map(({ id, title }) => {
                    return <h2
                        key={id}
                        className={classNames(styles.title, { [styles.active]: activeId === id })}
                        onClick={() => this.handleChange(id)}>
                        {title}
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

export default connect(mapStateToProps, mapDispatchToProps)(Tab);

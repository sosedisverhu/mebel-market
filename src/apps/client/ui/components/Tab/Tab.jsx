import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import setScrollToCharacteristic from '../../../actions/setScrollToCharacteristic';
import saveReview from '../../../services/client/saveReview';
import StyleRenderer from '../StyleRenderer/StyleRenderer';
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
                id: 'reviews',
                title: 'Отзывы'
            }
        ],
        scroll: data.scrollToCharacteristic
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setScrollToCharacteristic: payload => dispatch(setScrollToCharacteristic(payload)),
        saveReview: (...payload) => dispatch(saveReview(...payload))
    };
};

class Tab extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        tabs: PropTypes.array.isRequired,
        product: PropTypes.object.isRequired,
        scroll: PropTypes.bool.isRequired,
        setScrollToCharacteristic: PropTypes.func.isRequired,
        saveReview: PropTypes.func.isRequired
    };

    static defaultProps = {
        tabs: [],
        scroll: false
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
        const { activeId, userName, userPhone, userComment, userMark } = this.state;
        const { product, lang } = this.props;

        switch (activeId) {
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
        case 'reviews': {
            return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <p><label>
                            <input
                                type="text"
                                name='userName'
                                value={userName}
                                onChange={this.onChangeName}
                            />
                        </label></p>
                        <p><label>
                            <input
                                type="text"
                                name='usePhone'
                                value={userPhone}
                                onChange={this.onChangePhone}
                            />

                        </label></p>
                        <p><label>
                            <input
                                type="text"
                                name='userComment'
                                value={userComment}
                                onChange={this.onChangeComment}
                            />
                        </label></p>
                        <p><label>
                            <input
                                type="text"
                                name='mark'
                                value={userMark}
                                onChange={this.onChangeUserMark}
                            />
                        </label></p>
                        <button>Submit</button>
                    </form>
                </div>);
        }
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        const { userName, userPhone, userComment, userMark } = this.state;

        this.props.saveReview({
            user: {
                name: userName,
                emailOrPhone: userPhone,
                comment: userComment,
                mark: userMark
            },
            productId: this.props.product.id
        });
    };

    onChangeName = event => {
        this.setState({
            userName: event.target.value
        });
    };

    onChangePhone = event => {
        this.setState({
            userPhone: event.target.value
        });
    };

    onChangeComment = event => {
        this.setState({
            userComment: event.target.value
        });
    };

    onChangeUserMark = event => {
        this.setState({
            userMark: event.target.value
        });
    };

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

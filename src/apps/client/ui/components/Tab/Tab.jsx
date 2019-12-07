import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import setScrollToCharacteristic from '../../../actions/setScrollToCharacteristic';

import styles from './Tab.css';

const mapStateToProps = ({ data }) => {
    return {
        tabs: [
            {
                id: 'description',
                title: 'Описание'
            },
            {
                id: 'characteristic',
                title: 'Характеристики'
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
        tabs: PropTypes.array.isRequired,
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

        if (activeId === 'description') {
            return (
                <div className={styles.descr}>
                    <h3 className={styles.descrTitle}>Особенности конструкции</h3>
                    <p className={styles.descrText}>В ногах кровати отсутствует спинка, ...</p>
                    <h3 className={styles.descrTitle}>Цена на кровать АНТАЛИЯ</h3>
                    <p className={styles.descrText}>Цена на металлическую кровать АНТАЛИЯ ...</p>
                    <h3 className={styles.descrTitle}>Плюсы материала</h3>
                    <p className={styles.descrText}>Каркас кровати выполнен из бесшовных металлических ...</p>
                    <h3 className={styles.descrTitle}>Использование</h3>
                    <p className={styles.descrText}>Как небольшая уютная спальня, ...</p>
                </div>);
        }

        return (
            <div className={styles.caracter}>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Цвет</h3>
                    <p className={styles.caracterText}>Бежевый, Белый, Шоколад, Черный бархат</p>
                </div>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Цвет</h3>
                    <p className={styles.caracterText}>Бежевый, Белый, Шоколад, Черный бархат</p>
                </div>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Цвет</h3>
                    <p className={styles.caracterText}>Бежевый, Белый, Шоколад, Черный бархат</p>
                </div>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Цвет</h3>
                    <p className={styles.caracterText}>Бежевый, Белый, Шоколад, Черный бархат</p>
                </div>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Цвет</h3>
                    <p className={styles.caracterText}>Бежевый, Белый, Шоколад, Черный бархат</p>
                </div>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Цвет</h3>
                    <p className={styles.caracterText}>Бежевый, Белый, Шоколад, Черный бархат</p>
                </div>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Цвет</h3>
                    <p className={styles.caracterText}>Бежевый, Белый, Шоколад, Черный бархат</p>
                </div>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Гарантия</h3>
                    <p className={styles.caracterText}>12 месяцев</p>
                </div>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Материал</h3>
                    <p className={styles.caracterText}>Металл</p>
                </div>
                <div className={styles.row}>
                    <h3 className={styles.caracterTitle}>Максимальная нагрузка <span className={styles.caracterSpan}>(на одно спальное место)</span></h3>
                    <p className={styles.caracterText}>200 кг</p>
                </div>
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

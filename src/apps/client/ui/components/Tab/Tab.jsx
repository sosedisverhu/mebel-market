import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Tab.css';

const mapStateToProps = () => {
    return {
        tabs: [
            {
                id: 'description',
                title: 'Описание'
            },
            {
                id: 'caracteristic',
                title: 'Характеристики'
            }
        ]
    };
};

class Tab extends Component {
    static propTypes = {
        tabs: PropTypes.array.isRequired
    };

    static defaultProps = {
        tabs: []
    };

    state = {
        activeId: this.props.tabs[0] && this.props.tabs[0].id
    }

    handleChange (id) {
        this.setState({ activeId: id });
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
            <div className={styles.titles}>
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

export default connect(mapStateToProps)(Tab);
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import find from '@tinkoff/utils/array/find';
import outsideClick from '../../hocs/outsideClick';

import styles from './Sort.css';

const SORTING_OPTIONS = [
    {
        texts: {
            ru: 'От новых к старым',
            ua: 'Від нових до старих'
        },
        id: 'dateNew',
        sort: (product, nextProduct) => nextProduct.date - product.date
    },
    {
        texts: {
            ru: 'От старых к новым',
            ua: 'Від старих до нових'
        },
        id: 'dateOld',
        sort: (product, nextProduct) => product.date - nextProduct.date
    },
    {
        texts: {
            ru: 'От дешевых к дорогим',
            ua: 'Від дешевих до дорогих'
        },
        id: 'priceMin',
        sort: (product, nextProduct) => product.minPrice - nextProduct.minPrice
    },
    {
        texts: {
            ru: 'От дорогих к дешевым',
            ua: 'Від дорогих до дешевих'
        },
        id: 'priceMax',
        sort: (product, nextProduct) => nextProduct.minPrice - product.minPrice
    },
    {
        texts: {
            ru: 'По популярности',
            ua: 'За популярністю'
        },
        text: 'По популярности',
        id: 'view',
        sort: (product, nextProduct) => nextProduct.views - product.views
    }
];

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang
    };
};

@outsideClick
class Sort extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    };

    state = {
        active: false,
        valueOption: SORTING_OPTIONS[0].id
    };

    handleSelectClose = () => {
        this.setState({ active: false });
    };

    handleActiveClick = () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;
        this.setState(state => ({ active: !state.active }));

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleSelectClose);
        }
    };

    handleActiveSortClick = valueOption => {
        this.setState({ valueOption });
    };

    render () {
        const { lang } = this.props;
        const { active, valueOption } = this.state;
        const activeOption = find(sort => sort.id === valueOption, SORTING_OPTIONS);

        return (
            <div className={classNames(styles.sort, { [styles.active]: active })} onClick={this.handleActiveClick}>
                <div className={styles.activeOption}>
                    {activeOption.texts[lang]}
                </div>
                <div className={styles.listOptions}>
                    {SORTING_OPTIONS.map((option, index) => {
                        return (
                            <div
                                key={index}
                                className={
                                    classNames(styles.option, {
                                        [styles.active]: valueOption === index
                                    })}
                                onClick={() => this.handleActiveSortClick(option.id)}>
                                {option.texts[lang]}
                            </div>
                        );
                    })}
                </div>
            </div>);
    }
}

export default connect(mapStateToProps)(Sort);

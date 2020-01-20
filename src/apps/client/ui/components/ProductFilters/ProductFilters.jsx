import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import styles from './ProductFilters.css';

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
        sort: (product, nextProduct) => product.price - nextProduct.price
    },
    {
        texts: {
            ru: 'От дорогих к дешевым',
            ua: 'Від дорогих до дешевих'
        },
        id: 'priceMax',
        sort: (product, nextProduct) => nextProduct.price - product.price
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

class ProductFilters extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        media: PropTypes.object.isRequired,
        onFilter: PropTypes.func.isRequired
    };

    static defaultProps = {};

    state = {
        activeFilter: 0,
        filtersIsOpen: false,
        activeOptionText: ''
    };

    componentDidMount () {
        this.setActiveOptionText();
    }

    componentWillReceiveProps (nextProps, nextContext) {
        const { media, lang } = nextProps;
        const { activeFilter } = this.state;

        if (media.width !== this.props.media.width) {
            this.setActiveOptionText(activeFilter, media, lang);
        }
    }

    setActiveOptionText = (activeFilter = 0, media = this.props.media, lang = this.props.lang) => {
        this.setState({
            activeOptionText: media.width > 450 ? SORTING_OPTIONS[activeFilter].texts[lang] : SORTING_OPTIONS[activeFilter].texts[lang].slice(0, 12) + '...'
        });
    };

    onFiltersClick = () => {
        this.setState({
            filtersIsOpen: !this.state.filtersIsOpen
        });
    };

    onFilterOptionClick = (i, filter, arr) => {
        this.setState({
            activeFilter: i
        });
        this.setActiveOptionText(i);

        this.props.onFilter(filter.id, arr);
    };

    render () {
        const { lang } = this.props;
        const { activeFilter, filtersIsOpen, activeOptionText } = this.state;

        return (
            <div>
                <ul className={styles.sort}
                    onClick={this.onFiltersClick}
                >
                    <li className={classNames(styles.activeOption, { [styles.activeOptionClicked]: filtersIsOpen })}>
                        {activeOptionText}
                    </li>
                    {SORTING_OPTIONS.map((filter, i, arr) => {
                        if (i === activeFilter) {
                            return;
                        }
                        return (
                            <li className={classNames(styles.option, { [styles.optionClicked]: filtersIsOpen })}
                                onClick={() => this.onFilterOptionClick(i, filter, arr)}
                                key={filter.id}
                            >
                                {filter.texts[lang]}
                            </li>);
                    })}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = ({ application }) => {
    return {
        lang: application.lang,
        media: application.media
    };
};

export default connect(mapStateToProps)(ProductFilters);

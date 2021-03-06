import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import outsideClick from '../../hocs/outsideClick';

import styles from './ProductSort.css';

const SORTING_OPTIONS = [
    {
        texts: {
            ru: 'От новых к старым',
            ua: 'Від нових до старих'
        },
        id: 'dateNew',
        sort: (type) => (product, nextProduct) => {
            if (type) {
                if (type === 'category') {
                    return product.positionIndexInCategory - nextProduct.positionIndexInCategory;
                } else {
                    return product.positionIndexInSubCategory - nextProduct.positionIndexInSubCategory;
                }
            }

            return product.date - nextProduct.date;
        }
    },
    {
        texts: {
            ru: 'От старых к новым',
            ua: 'Від старих до нових'
        },
        id: 'dateOld',
        sort: (type) => (product, nextProduct) => {
            if (type) {
                if (type === 'category') {
                    return nextProduct.positionIndexInCategory - product.positionIndexInCategory;
                } else {
                    return nextProduct.positionIndexInSubCategory - product.positionIndexInSubCategory;
                }
            }

            return nextProduct.date - product.date;
        }
    },
    {
        texts: {
            ru: 'От дешевых к дорогим',
            ua: 'Від дешевих до дорогих'
        },
        id: 'priceMin',
        sort: () => (product, nextProduct) => product.actualPrice - nextProduct.actualPrice
    },
    {
        texts: {
            ru: 'От дорогих к дешевым',
            ua: 'Від дорогих до дешевих'
        },
        id: 'priceMax',
        sort: () => (product, nextProduct) => nextProduct.actualPrice - product.actualPrice
    },
    {
        texts: {
            ru: 'По популярности',
            ua: 'За популярністю'
        },
        text: 'По популярности',
        id: 'view',
        sort: () => (product, nextProduct) => nextProduct.views - product.views
    }
];

@outsideClick
class ProductSort extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        media: PropTypes.object.isRequired,
        onFilter: PropTypes.func.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        type: PropTypes.string
    };

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
        const { filtersIsOpen } = this.state;

        if (filtersIsOpen) {
            this.handleFiltersClose();
        } else {
            this.handleFiltersOpen();

            this.props.turnOnClickOutside(this, this.handleFiltersClose);
        }
    };

    handleFiltersOpen = () => {
        this.setState({
            filtersIsOpen: true
        });
    };

    handleFiltersClose = () => {
        this.setState({
            filtersIsOpen: false
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

export default connect(mapStateToProps)(ProductSort);

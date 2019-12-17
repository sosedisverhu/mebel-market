import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from '@tinkoff/utils/is/empty';

import FilterCheckBox from '../FilterCheckBox/FilterCheckBox';
import FilterSlider from '../FilterSlider/FilterSlider';
import styles from './Filters.css';

const Filters = props => {
    const { filters, minAndMaxPrices, onFilterByPrice } = props;

    return (
        <div className={styles.filters}>
            {(!isEmpty(filters) && minAndMaxPrices) &&
            filters.map(filter => {
                return (filter.type === 'checkbox')
                    ? <FilterCheckBox
                        filter={filter}
                        key={filter.id}
                    />
                    : <FilterSlider
                        filter={filter}
                        minAndMaxPrices={minAndMaxPrices}
                        onFilter={onFilterByPrice}
                        key={filter.id}
                    />;
            })}
        </div>);
};

Filters.propTypes = {
    filters: PropTypes.array.isRequired,
    minAndMaxPrices: PropTypes.object.isRequired,
    onFilterByPrice: PropTypes.func.isRequired
};

export default Filters;

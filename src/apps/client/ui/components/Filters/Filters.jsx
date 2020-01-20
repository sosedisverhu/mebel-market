import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from '@tinkoff/utils/is/empty';

import FilterCheckBox from '../FilterCheckBox/FilterCheckBox';
import FilterSlider from '../FilterSlider/FilterSlider';
import styles from './Filters.css';

const Filters = props => {
    const handleFilter = filter => values => {
        props.onFilter(filter, values);
    };

    const { filters, filtersMap } = props;

    return (
        <div className={styles.filters}>
            {!isEmpty(filters) &&
            filters.map(filter => {
                return filter.type === 'checkbox'
                    ? <FilterCheckBox
                        key={filter.id}
                        onFilter={handleFilter(filter)}
                        filtersMap={filtersMap}
                        filter={filter}
                    />
                    : <FilterSlider
                        key={filter.id}
                        onFilter={handleFilter(filter)}
                        filtersMap={filtersMap}
                        filter={filter}
                    />;
            })}
        </div>);
};

Filters.propTypes = {
    onFilter: PropTypes.func.isRequired,
    filtersMap: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired
};

export default Filters;

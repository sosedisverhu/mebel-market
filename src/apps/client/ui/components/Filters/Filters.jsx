import React from 'react';
import PropTypes from 'prop-types';

import isEmpty from '@tinkoff/utils/is/empty';

import FilterCheckBox from '../FilterCheckBox/FilterCheckBox';
import FilterSlider from '../FilterSlider/FilterSlider';
import styles from './Filters.css';

const Filters = props => {
    const { filters, onFilter } = props;

    return (
        <div className={styles.filters}>
            {!isEmpty(filters) &&
            filters.map(filter => {
                return (filter.type === 'checkbox')
                    ? <FilterCheckBox
                        filter={filter}
                        onFilter={onFilter}
                        key={filter.id}
                    />
                    : <FilterSlider
                        filter={filter}
                        key={filter.id}
                    />;
            })}
        </div>);
};

Filters.propTypes = {
    filters: PropTypes.array.isRequired,
    onFilter: PropTypes.func.isRequired
};

export default Filters;

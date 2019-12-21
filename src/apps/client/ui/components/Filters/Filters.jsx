import React, { Component } from 'react';
import PropTypes from 'prop-types';

import isEmpty from '@tinkoff/utils/is/empty';

import FilterCheckBox from '../FilterCheckBox/FilterCheckBox';
import FilterSlider from '../FilterSlider/FilterSlider';
import styles from './Filters.css';

class Filters extends Component {
    static propTypes = {
        onFilter: PropTypes.func.isRequired,
        filtersMap: PropTypes.object.isRequired,
        filters: PropTypes.array.isRequired
    };

    handleFilter = filter => values => {
        this.props.onFilter(filter, values);
    };

    render () {
        const { filters, filtersMap } = this.props;

        return (
            <div className={styles.filters}>
                {!isEmpty(filters) &&
                filters.map(filter => {
                    return filter.type === 'checkbox'
                        ? <FilterCheckBox
                            key={filter.id}
                            onFilter={this.handleFilter(filter)}
                            filtersMap={filtersMap}
                            filter={filter}
                        />
                        : <FilterSlider
                            key={filter.id}
                            onFilter={this.handleFilter(filter)}
                            filtersMap={filtersMap}
                            filter={filter}
                        />;
                })}
            </div>);
    }
}

export default Filters;

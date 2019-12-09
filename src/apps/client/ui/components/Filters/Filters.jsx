import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Filters.css';
import FilterCheckBox from '../FilterCheckBox/FilterCheckBox';
import FilterSlider from '../FilterSlider/FilterSlider';

const mapStateToProps = () => {
    return {
        filters: [
            {
                id: '1',
                type: 'checkbox',
                title: 'Бренд',
                options: ['Fusion Metal (9)']
            },
            {
                id: '2',
                type: 'checkbox',
                title: 'Гарантия',
                options: ['12 месяцев (8)', '18 месяцев (3)']
            },
            {
                id: '3',
                type: 'checkbox',
                title: 'Материал',
                options: ['Метал (9)', 'Дерево (2)']
            },
            {
                id: '4',
                type: 'checkbox',
                title: 'Максимальная нагрузка',
                options: ['120 КГ (1)', '150 КГ (4)', '200 КГ (2)', '250 КГ (3)']
            },
            {
                id: '6',
                type: 'slider',
                title: 'Цена',
                max: '5',
                min: '3',
                step: 0.1
            }
        ]
    };
};

class Filters extends Component {
    static propTypes = {
        filters: PropTypes.array.isRequired
    };

    render () {
        const { filters } = this.props;

        return (
            <div className={styles.filters}>
                {filters.map(filter => {
                    return (filter.type === 'checkbox')
                        ? <FilterCheckBox key={filter.id} filter={filter}/>
                        : <FilterSlider key={filter.id} filter={filter}/>;
                })}
            </div>);
    }
}

export default connect(mapStateToProps)(Filters);

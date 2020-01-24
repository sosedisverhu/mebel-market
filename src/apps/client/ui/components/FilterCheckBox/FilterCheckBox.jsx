import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import includes from '@tinkoff/utils/array/includes';
import findIndex from '@tinkoff/utils/array/findIndex';
import outsideClick from '../../hocs/outsideClick';

import styles from './FilterCheckBox.css';

@outsideClick
class FilterCheckBox extends Component {
    static propTypes = {
        filter: PropTypes.shape({
            name: PropTypes.string.isRequired,
            options: PropTypes.array.isRequired,
            id: PropTypes.string.isRequired
        }),
        filtersMap: PropTypes.object.isRequired,
        onFilter: PropTypes.func.isRequired
    };

    state = {
        active: false
    };

    handleLabelChecked = option => e => {
        const { filter: { id }, filtersMap } = this.props;
        const value = propOr('values', [], filtersMap[id]);
        const newValue = [...value];

        if (e.target.checked) {
            newValue.push(option);
        } else {
            const currentIdIndex = findIndex(valueOption => valueOption === option, value);

            newValue.splice(currentIdIndex, 1);
        }

        this.props.onFilter(newValue);
    };

    handleTitleClick = () => {
        const { outsideClickEnabled, turnOnClickOutside } = this.props;

        this.setState((state) => ({ active: !state.active }));

        if (!this.state.active && !outsideClickEnabled) {
            turnOnClickOutside(this, this.handleFilterClose);
        }
    };

    handleFilterClose = () => {
        this.setState({ active: false });
    };

    render () {
        const { filter: { name, options, id }, filtersMap } = this.props;
        const { active } = this.state;

        return (
            <div className={classNames(
                styles.filter,
                { [styles.active]: active }
            )}>
                <h2 className={styles.title}
                    onClick={this.handleTitleClick}
                >{name}</h2>
                <div className={styles.options}>
                    {options.map((option, index) => {
                        const value = filtersMap[id] ? includes(option, filtersMap[id].values) : false;

                        return (
                            <label key={index} className={styles.option}>
                                <input
                                    className={styles.input}
                                    type="checkbox"
                                    onChange={this.handleLabelChecked(option)}
                                    checked={value}
                                />
                                <div className={styles.circle}/>
                                {option}
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default FilterCheckBox;

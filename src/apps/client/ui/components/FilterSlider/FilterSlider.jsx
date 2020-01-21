import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick';
import pick from '@tinkoff/utils/object/pick';

import InputRange from 'react-input-range';

import styles from './FilterSlider.css';

@outsideClick
class FilterSlider extends Component {
    static propTypes = {
        filter: PropTypes.shape({
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired
        }),
        filtersMap: PropTypes.object.isRequired,
        onFilter: PropTypes.func.isRequired
    };

    constructor (...args) {
        super(...args);

        const value = this.getDefaultValue();

        this.state = {
            defaultValue: value,
            step: this.getStep(value),
            value,
            active: false
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.filter !== this.props.filter) {
            const value = this.getDefaultValue(nextProps);

            this.setState({
                defaultValue: value,
                step: this.getStep(value),
                value
            });
        }

        if (!nextProps.filtersMap[nextProps.filter.id] && this.props.filtersMap[nextProps.filter.id]) {
            this.setState({
                value: this.state.defaultValue
            });
        }
    }

    getStep = ({ min, max }) => {
        switch (true) {
        case (max - min < 1):
            return 0.001;
        case (max - min < 100):
            return 0.01;
        default:
            return 1;
        }
    };

    handleFilterClose = () => {
        this.setState({ active: false });
    };

    handleTitleClick = () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;
        this.setState({ active: !active });

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleFilterClose);
        }
    };

    getDefaultValue = (props = this.props) => {
        return {
            ...pick(['min', 'max'], props.filter)
        };
    };

    handleInputChange = value => {
        const { defaultValue: { min, max } } = this.state;

        this.setState({
            value: {
                min: value.min < min ? min : value.min,
                max: value.max > max ? max : value.max
            }
        });
    };

    handleIntroduceValue = (e, valueName) => {
        const { value, defaultValue } = this.state;

        if (!isNaN(e.target.value) && +e.target.value <= defaultValue.max) {
            const eTarget = e.target.value !== '' ? +e.target.value : '';
            const newValue = valueName === 'min' ? { ...value, min: eTarget } : { ...value, max: eTarget };

            this.setState({
                value: newValue
            });

            this.props.onFilter(newValue);
        }
    };

    priceOnBlur = () => {
        const { defaultValue, value } = this.state;

        if (value.min > value.max) {
            this.setState({
                value: defaultValue
            });
            return this.props.onFilter(defaultValue);
        }

        if (defaultValue.min > value.min) {
            this.setState({
                value: { ...value, min: defaultValue.min }
            });
        }

        this.props.onFilter(value);
    };

    render () {
        const { filter: { name } } = this.props;
        const { defaultValue: { min, max }, value, step, active } = this.state;

        return (
            <div className={classNames(styles.filter, { [styles.active]: active })}>
                <div className={styles.title} onClick={this.handleTitleClick}>
                    {name}
                </div>
                <div className={styles.sliderWrapper}>
                    <div className={styles.customLabels}>
                        <input className={styles.customLabel}
                            value={value.min}
                            onChange={e => this.handleIntroduceValue(e, 'min')}
                            onBlur={() => this.priceOnBlur()}
                        />
                        <input className={styles.customLabel}
                            value={value.max}
                            onChange={e => this.handleIntroduceValue(e, 'max')}
                            onBlur={() => this.priceOnBlur()}
                        />
                    </div>
                    <InputRange
                        maxValue={+max}
                        minValue={+min}
                        classNames={{
                            inputRange: styles.inputRange,
                            minLabel: styles.minLabel,
                            maxLabel: styles.maxLabel,
                            valueLabel: styles.label,
                            track: styles.track,
                            activeTrack: styles.activeTrack,
                            sliderContainer: styles.sliderContainer,
                            slider: styles.slider
                        }}
                        formatLabel={value => `${Number((value))}`}
                        step={step}
                        value={value}
                        onChange={this.handleInputChange}
                        onChangeComplete={() => this.props.onFilter(value)}
                    />
                </div>
            </div>
        );
    }
}

export default FilterSlider;

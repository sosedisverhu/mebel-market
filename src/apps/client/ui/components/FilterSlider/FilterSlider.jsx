import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick';

import InputRange from 'react-input-range';

import styles from './FilterSlider.css';

@outsideClick
class FilterSlider extends Component {
    static propTypes = {
        filter: PropTypes.shape({
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired
        }),
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    };

    static defaultProps = {
        additionalClass: ''
    };

    constructor (...args) {
        super(...args);

        this.state = {
            defaultValue: {},
            step: 0,
            value: {},
            active: false,
            loaded: false
        };
    }

    componentDidMount () {
        this.setNewState();
    }

    setNewState = (props = this.props) => {
        const value = { min: 1000, max: 10000 };

        this.setState({
            defaultValue: value,
            step: this.getStep(value),
            value: value,
            loaded: true
        });
    };

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

    handleInputChange = value => {
        const { defaultValue: { min, max } } = this.state;

        this.setState({
            value: {
                min: value.min < min ? min : value.min,
                max: value.max > max ? max : value.max
            }
        });
    };

    render () {
        const { filter: { name } } = this.props;
        const { defaultValue: { min, max }, value, step, active, loaded } = this.state;

        return (
            <div className={classNames(styles.filter, { [styles.active]: active })}>
                <div className={styles.title} onClick={this.handleTitleClick}>
                    {name}
                </div>
                {loaded &&
                <div className={styles.sliderWrapper}>
                    <div className={styles.customLabels}>
                        <div className={styles.customLabel}>
                            {value.min.toFixed(0)}  &#8372;
                        </div>
                        <div className={styles.customLabel}>
                            {value.max.toFixed(0)}  &#x20b4;
                        </div>
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
                        formatLabel={value => `${Number((value).toFixed(1))}`}
                        step={step}
                        value={value}
                        onChange={this.handleInputChange}
                    />
                </div>}
            </div>
        );
    }
}

export default FilterSlider;

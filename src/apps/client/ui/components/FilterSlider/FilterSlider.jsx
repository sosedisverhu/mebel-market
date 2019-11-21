import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick';

import InputRange from 'react-input-range';

import pick from '@tinkoff/utils/object/pick';

import styles from './FilterSlider.css';

const mapStateToProps = ({ data }) => {
    return {
        filters: data.filters
    };
};

@outsideClick
class FilterSlider extends Component {
    static propTypes = {
        filter: PropTypes.shape({
            title: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired
        }),
        filtersMap: PropTypes.object.isRequired,
        onFilter: PropTypes.func.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    };

    static defaultProps = {
        additionalClass: ''
    };

    constructor (...args) {
        super(...args);

        // const value = this.getDefaultValue();
        const value = { 'min': 1349, 'max': 4100 };

        this.state = {
            defaultValue: value,
            step: this.getStep(value),
            value,
            active: false
        };
    }

    // componentWillReceiveProps (nextProps) {
    //     if (nextProps.filter !== this.props.filter) {
    //         const value = this.getDefaultValue(nextProps);

    //         this.setState({
    //             defaultValue: value,
    //             step: this.getStep(value),
    //             value
    //         });
    //     }

    //     if (!nextProps.filtersMap[nextProps.filter.id] && this.props.filtersMap[nextProps.filter.id]) {
    //         this.setState({
    //             value: this.state.defaultValue
    //         });
    //     }
    // }

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

    render () {
        const { filter: { title } } = this.props;
        const { defaultValue: { min, max }, value, step, active } = this.state;

        return (
            <div className={classNames(styles.filter, { [styles.active]: active })}>
                <div className={styles.title} onClick={this.handleTitleClick}>{title}</div>
                <div className={styles.sliderWrapper}>
                    <div className={styles.customLabels}>
                        <div className={styles.customLabel}>{value.min.toFixed(0)}  &#8372;</div>
                        <div className={styles.customLabel}>{value.max.toFixed(0)}  &#x20b4;</div>
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
                        onChangeComplete={this.props.onFilter}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(FilterSlider);

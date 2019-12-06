import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import outsideClick from '../../hocs/outsideClick';

import styles from './FilterCheckBox.css';

@outsideClick
class FilterCheckBox extends Component {
    static propTypes = {
        filter: PropTypes.object.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    };

    state = {
        active: false
    }

    handleTitleClick = () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;

        this.setState({ active: !active });

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this, this.handleFilterClose);
        }
    };

    handleFilterClose = () => {
        this.setState({ active: false });
    };

    render () {
        const { filter: { title, options } } = this.props;
        const { active } = this.state;

        return (
            <div onClick={this.handleTitleClick} className={classNames(styles.filter, { [styles.active]: active })}>
                <div className={styles.title}>{title}</div>
                <div className={styles.options}>
                    {options.map((option, index) => {
                        return (
                            <label key={index} className={styles.option}>
                                <input
                                    className={styles.input}
                                    type="checkbox"
                                />
                                <div className={styles.circle} />
                                {option}
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default connect()(FilterCheckBox);

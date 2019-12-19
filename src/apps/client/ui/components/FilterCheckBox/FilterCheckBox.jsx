import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import outsideClick from '../../hocs/outsideClick';

import styles from './FilterCheckBox.css';

@outsideClick
class FilterCheckBox extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        filter: PropTypes.object.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    };

    state = {
        active: false,
        name: '',
        options: []
    };

    componentDidMount () {
        this.setNewState();
    }

    componentWillReceiveProps (nextProps, nextContext) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.setNewState();
        }
    }

    setNewState = (props = this.props) => {
        const { filter } = props;

        this.setState({
            name: filter.name,
            options: filter.options.map(option => {
                return { ...option, checked: true };
            })
        });
    };

    handleTitleClick = () => {
        const { outsideClickEnabled, turnOnClickOutside } = this.props;
        const { active } = this.state;

        this.setState({ active: !active });

        if (!active && !outsideClickEnabled) {
            turnOnClickOutside(this, this.handleFilterClose);
        }
    };

    handleFilterClose = () => {
        this.setState({ active: false });
    };

    render () {
        const { active, name, options } = this.state;

        return (
            <div onClick={this.handleTitleClick}
                className={classNames(styles.filter, { [styles.active]: active })}
            >
                <div className={styles.title}>
                    {name}
                </div>
                <div className={styles.options}>
                    {options.map((option, i) => {
                        return (
                            <label key={i} className={styles.option}>
                                <input
                                    className={styles.input}
                                    type="checkbox"
                                />
                                <div className={styles.circle}/>
                                <span>{option.name}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default withRouter(FilterCheckBox);

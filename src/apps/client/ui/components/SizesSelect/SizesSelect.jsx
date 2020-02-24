import React, { Component } from 'react';
import PropTypes from 'prop-types';
import outsideClick from '../../hocs/outsideClick';
import classNames from 'classnames';

import styles from '../AboutProduct/AboutProduct.css';

@outsideClick
class SizesSelect extends Component {
    static propTypes = {
        activeSize: PropTypes.object,
        sizes: PropTypes.object,
        sizeListIsOpenSwitch: PropTypes.func,
        selectIsOpenSwitch: PropTypes.func,
        selectIsClosedSwitch: PropTypes.func,
        handleChangeSize: PropTypes.func,
        selectIsOpen: PropTypes.bool,
        sizeListIsOpen: PropTypes.bool,
        isPromotion: PropTypes.bool,
        lang: PropTypes.string,
        turnOnClickOutside: PropTypes.func,
        outsideClickEnabled: PropTypes.bool
    };

    handleOpenSizes = () => {
        const { outsideClickEnabled, turnOnClickOutside, selectIsOpenSwitch, selectIsClosedSwitch, selectIsOpen } = this.props;

        if (selectIsOpen) {
            selectIsClosedSwitch();
        } else {
            selectIsOpenSwitch();
            !outsideClickEnabled && turnOnClickOutside(this, selectIsClosedSwitch);
        }
    };

    render () {
        const { selectIsOpen, activeSize, sizes, sizeListIsOpen, isPromotion, lang, sizeListIsOpenSwitch, handleChangeSize } = this.props;
        let sizeCounter = 0;
        const actualSizes = isPromotion
            ? sizes[lang].filter(size => size.colors.some(color => color.action))
            : sizes[lang];
        const isOneSize = actualSizes.length === 1;

        return (
            <ul className={classNames(styles.select, { [styles.active]: selectIsOpen })}
                onMouseEnter={() => sizeListIsOpenSwitch()}
                onClick={this.handleOpenSizes}
            >
                <li className={classNames(styles.activeOption, { [styles.oneActiveOption]: isOneSize })}>
                    {activeSize.name}
                </li>
                {actualSizes.map(size => {
                    if (size.id !== activeSize.id && sizeListIsOpen) {
                        sizeCounter++;

                        if (isPromotion && size.colors.every(color => !color.action)) return;
                        return <li className={styles.option}
                            onClick={() => handleChangeSize(size)}
                            style={{ top: `${30 * sizeCounter}px` }}
                            key={size.id}>
                            {size.name}
                        </li>;
                    }
                })}
            </ul>);
    }
}

export default SizesSelect;

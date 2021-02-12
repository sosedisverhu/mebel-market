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
        additionalClass: PropTypes.string,
        sizeListIsOpenSwitch: PropTypes.func,
        selectIsOpenSwitch: PropTypes.func,
        selectIsClosedSwitch: PropTypes.func,
        handleChangeSize: PropTypes.func,
        selectIsOpen: PropTypes.bool,
        sizeListIsOpen: PropTypes.bool,
        isPromotion: PropTypes.bool,
        lang: PropTypes.string,
        turnOnClickOutside: PropTypes.func,
        outsideClickEnabled: PropTypes.bool,
        isCardSelect: PropTypes.bool
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
        const {
            selectIsOpen,
            activeSize,
            sizes,
            sizeListIsOpen,
            isPromotion,
            lang,
            sizeListIsOpenSwitch,
            handleChangeSize,
            additionalClass,
            isCardSelect
        } = this.props;
        let sizeCounter = 0;
        const actualSizes = isPromotion
            ? sizes[lang].filter(size => size.colors.some(color => color.action))
            : sizes[lang];
        const isOneSize = actualSizes.length === 1;

        return (
            <ul className={classNames(styles.select, { [styles.active]: selectIsOpen }, { [styles[additionalClass]]: additionalClass })}
                onMouseEnter={() => sizeListIsOpenSwitch()}
                onClick={this.handleOpenSizes}
            >
                <li className={classNames(styles.activeOption, { [styles.oneActiveOption]: isOneSize }, { [styles.cardActiveOption]: isCardSelect })}>
                    {activeSize.name}
                </li>
                <div className={styles.otherSizes}>
                    {actualSizes.map((size, i) => {
                        if (size.id !== activeSize.id && sizeListIsOpen) {
                            sizeCounter++;

                            if (isPromotion && size.colors.every(color => !color.action)) return;
                            return <li className={classNames(styles.option, { [styles.cardOption]: isCardSelect })}
                                onClick={() => handleChangeSize(size)}
                                style={{ bottom: `${(isCardSelect ? 0 : 30) * sizeCounter}px` }}
                                key={size.id}>
                                {size.name}
                            </li>;
                        }
                    })}
                </div>
            </ul>);
    }
}

export default SizesSelect;

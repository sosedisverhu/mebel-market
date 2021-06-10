import React, { Component } from 'react';
import PropTypes from 'prop-types';
import outsideClick from '../../hocs/outsideClick';
import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';

@outsideClick
class ColorsSelect extends Component {
    static propTypes = {
        activeSize: PropTypes.object,
        styles: PropTypes.object,
        activeColor: PropTypes.object,
        handleChangePopup: PropTypes.func,
        changeColorListOpen: PropTypes.func,
        changeColorListClose: PropTypes.func,
        handleChangeColor: PropTypes.func,
        popupAllOpen: PropTypes.func,
        colorListOpen: PropTypes.bool,
        isPromotion: PropTypes.bool,
        turnOnClickOutside: PropTypes.func,
        outsideClickEnabled: PropTypes.bool,
        withPopup: PropTypes.bool,
        withPopupAll: PropTypes.bool,
        popupColorsOpened: PropTypes.bool
    };

    static defaultProps = {
        handleChangePopup: noop,
        popupAllOpen: noop,
        withPopup: false,
        withPopupAll: false
    };

    handleOpenColors = () => {
        const { outsideClickEnabled, turnOnClickOutside, changeColorListOpen, changeColorListClose, colorListOpen,
            withPopupAll, popupAllOpen, popupColorsOpened } = this.props;

        if (!withPopupAll) {
            if (colorListOpen) {
                changeColorListClose();
            } else {
                changeColorListOpen();
                !outsideClickEnabled && turnOnClickOutside(this, changeColorListClose);
            }
        } else {
            if (!popupColorsOpened) {
                popupAllOpen();
            }
        }
    };

    render () {
        const { activeSize, isPromotion, activeColor, handleChangeColor, handleChangePopup, withPopup, styles } = this.props;
        const colors = activeSize.colors;
        const actualColors = isPromotion ? colors.filter(color => color.action) : colors;
        const isOneColor = actualColors.length === 1;
        const activeColorIndex = actualColors.findIndex(color => color.id === activeColor.id);

        return (
            <div className={styles.colorsWrapper}>
                <div className={classNames(styles.color, styles.activeColor, { [styles.oneActiveColor]: isOneColor })}>
                    <img className={styles.colorImg} src={activeColor.file} alt={activeColor.name} onClick={this.handleOpenColors}/>
                    {withPopup && <div className={styles.view} onClick={() => handleChangePopup(activeColorIndex)} />}
                </div>
                <ul className={styles.colorList}>
                    {actualColors.map((color, i) => {
                        if (color.id !== activeColor.id) {
                            return <li className={styles.color}
                                key={color.id}>
                                <img className={styles.colorImg} onClick={() => handleChangeColor(color)} src={color.file} alt={color.name} />
                                <div className={styles.view} onClick={() => handleChangePopup(i)} />
                            </li>;
                        }
                    })}
                </ul>
            </div>);
    }
}

export default ColorsSelect;

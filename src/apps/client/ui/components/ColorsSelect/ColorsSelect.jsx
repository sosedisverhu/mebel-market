import React, { Component } from 'react';
import PropTypes from 'prop-types';
import outsideClick from '../../hocs/outsideClick';
import classNames from 'classnames';

import styles from '../AboutProduct/AboutProduct.css';

@outsideClick
class ColorsSelect extends Component {
    static propTypes = {
        activeSize: PropTypes.object,
        activeColor: PropTypes.object,
        handleChangePopup: PropTypes.func,
        changeColorListOpen: PropTypes.func,
        changeColorListClose: PropTypes.func,
        handleChangeColor: PropTypes.func,
        colorListOpen: PropTypes.bool,
        isPromotion: PropTypes.bool,
        turnOnClickOutside: PropTypes.func,
        outsideClickEnabled: PropTypes.bool
    };

    handleOpenColors = () => {
        const { outsideClickEnabled, turnOnClickOutside, changeColorListOpen, changeColorListClose, colorListOpen } = this.props;

        if (colorListOpen) {
            changeColorListClose();
        } else {
            changeColorListOpen();
            !outsideClickEnabled && turnOnClickOutside(this, changeColorListClose);
        }
    };

    render () {
        const { activeSize, isPromotion, activeColor, handleChangeColor, handleChangePopup } = this.props;
        const colors = activeSize.colors;
        const actualColors = isPromotion ? colors.filter(color => color.action) : colors;
        const isOneColor = actualColors.length === 1;
        const activeColorIndex = actualColors.findIndex(color => color.id === activeColor.id);

        return (
            <div className={styles.colorsWrapper}>
                <div className={classNames(styles.color, styles.activeColor, { [styles.oneActiveColor]: isOneColor })} onClick={this.handleOpenColors}>
                    <img className={styles.colorImg} src={activeColor.file} alt={activeColor.name} />
                    <div className={styles.view} onClick={() => handleChangePopup(activeColorIndex)} />
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

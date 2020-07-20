import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import propOr from '@tinkoff/utils/object/propOr';
import classNames from 'classnames';

import SizesSelect from '../SizesSelect/SizesSelect';
import ColorsSelect from '../ColorsSelect/ColorsSelect';

import styles from './PresentProductCard.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang
    };
};

class PresentProductCard extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        changeColor: PropTypes.func.isRequired,
        changeSize: PropTypes.func.isRequired,
        product: PropTypes.object.isRequired,
        isActive: PropTypes.bool.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            isSizeOpen: false,
            sizeListIsOpen: true,
            colorListOpen: false
        };

        this.popup = React.createRef();
    }

    componentDidMount () {
        disableBodyScroll(this.popup.current);
    }

    componentWillUnmount () {
        clearAllBodyScrollLocks();
    }

    sizeListIsOpen = () => {
        this.setState({
            sizeListIsOpen: true
        });
    };

    handleSizeOpen = () => {
        this.setState({ isSizeOpen: true });
    };

    handleSizeClose = () => {
        this.setState({ isSizeOpen: false });
    };

    handleChangeSize = activeSize => {
        this.props.changeSize(activeSize);
    };

    handleColorListOpen = () => this.setState({ colorListOpen: true });

    handleColorListClose = () => this.setState(({ colorListOpen: false }));

    handleChangeColor = activeColor => {
        this.props.changeColor(activeColor);
        this.handleColorListClose();
    };

    render () {
        const { lang, langMap, product, isActive } = this.props;
        const { activeSize, activeColor } = product;
        const { isSizeOpen, sizeListIsOpen, colorListOpen } = this.state;
        const text = propOr('product', {}, langMap);
        const actualSizes = product.sizes[lang];
        const colors = activeSize.colors;
        const actualColors = colors;
        const isOneSize = actualSizes.length === 1;
        const isOneColor = actualColors.length === 1;

        return <div className={classNames(styles.root, { [styles.active]: isActive })}>
            <div className={styles.imgWrap}>
                <img className={styles.img} src={product.avatar} alt=""/>
                <div className={styles.background} />
            </div>
            <div className={styles.properties}>
                <div className={styles.sizesWrap}>
                    <div className={styles.sizesTitle}>
                        {!isOneSize ? text.size : text.oneSize}
                    </div>
                    <SizesSelect
                        selectIsOpen={isSizeOpen}
                        activeSize={activeSize}
                        sizes={product.sizes}
                        sizeListIsOpen={sizeListIsOpen}
                        lang={lang}
                        sizeListIsOpenSwitch={this.sizeListIsOpen}
                        selectIsOpenSwitch={this.handleSizeOpen}
                        selectIsClosedSwitch={this.handleSizeClose}
                        handleChangeSize={this.handleChangeSize}
                    />
                </div>
                {(!isOneColor || product.viewOneColor) && <div className={classNames(styles.colorWrap, { [styles.active]: colorListOpen })}>
                    <div className={styles.colorTitle}>
                        {text.chooseColor}
                    </div>
                    <ColorsSelect
                        styles={styles}
                        activeSize={activeSize}
                        activeColor={activeColor}
                        handleChangeColor={this.handleChangeColor}
                        changeColorListOpen={this.handleColorListOpen}
                        changeColorListClose={this.handleColorListClose}
                        colorListOpen={colorListOpen}
                    />
                </div>}
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(PresentProductCard);

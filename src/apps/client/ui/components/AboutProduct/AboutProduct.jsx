import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import propOr from '@tinkoff/utils/object/propOr';
import setScrollToCharacteristic from '../../../actions/setScrollToCharacteristic';
import outsideClick from '../../hocs/outsideClick';

import styles from './AboutProduct.css';

import formatMoney from '../../../utils/formatMoney';
import AboutProductTop from '../AboutProductTop/AboutProductTop';

const SIZES = [
    {
        id: 1,
        value: '190 см * 200 см'
    },
    {
        id: 2,
        value: '10 см * 10 см'
    },
    {
        id: 3,
        value: '1500 см * 1500 см'
    },
    {
        id: 4,
        value: '200 см * 200 см'
    }
];

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setScrollToCharacteristic: payload => dispatch(setScrollToCharacteristic(payload))
    };
};

@outsideClick
class AboutProduct extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        product: PropTypes.object.isRequired,
        setScrollToCharacteristic: PropTypes.func.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    };

    constructor (props) {
        super(props);
        this.state = {
            active: false,
            activeOption: SIZES[0]
        };
        this.select = React.createRef();
    }

    scrollToTitles = () => {
        this.props.setScrollToCharacteristic(true);
    }

    handleOptionClick = activeOption => {
        this.setState({ activeOption });
    };

    handleSelectClose = () => {
        this.setState({ active: false });
    };

    handleSelectClick = () => {
        const { outsideClickEnabled } = this.props;
        const { active } = this.state;
        this.setState(state => ({ active: !state.active }));

        if (!active && !outsideClickEnabled) {
            this.props.turnOnClickOutside(this.select.current, this.handleSelectClose);
        }
    };

    render () {
        const { active, activeOption } = this.state;
        const { product, langMap } = this.props;
        const text = propOr('product', {}, langMap);

        return <div className={styles.root}>
            <AboutProductTop product={product} />
            <div className={styles.advantagesTitle}>{text.advantages}</div>
            <ul className={styles.advantages}>
                <li className={styles.advantage}>просторность</li>
                <li className={styles.advantage}>универсальность</li>
                <li className={styles.advantage}>функциональность</li>
                <li className={styles.advantage}>простой и стильный дизайн</li>
                <li className={styles.advantage}>высокое ложе</li>
                <li className={styles.advantage}>удобное основание</li>
                <li className={styles.advantage}>простота в уходе</li>
            </ul>
            <div className={styles.details} onClick={this.scrollToTitles}>{text.details}</div>
            <div className={styles.priceOld}>{formatMoney(2798)}</div>
            <div className={styles.price}>{formatMoney(1399)}</div>
            <div className={styles.sizes}>
                <div className={styles.sizesTitle}>Выберите размер:</div>
                <div className={classNames(styles.select, { [styles.active]: active })} ref={this.select} onClick={this.handleSelectClick}>
                    <div className={styles.activeOption}>{activeOption.value}</div>
                    <div className={styles.listOptions}>
                        {SIZES.map((option, index) => {
                            return (
                                <div
                                    key={index}
                                    className={
                                        classNames(styles.option, {
                                            [styles.active]: option.id === activeOption.id
                                        })}
                                    onClick={() => this.handleOptionClick(option)}>
                                    {option.value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                <button className={styles.btnBuy}>{text.buy}</button>
                <button className={styles.btnWishList}></button>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutProduct);

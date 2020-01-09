import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import propOr from '@tinkoff/utils/object/propOr';

import styles from './Slider.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        banners: application.mainSlides
    };
};

class Slider extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        banners: PropTypes.array
    };

    static defaultProps = {
        banners: []
    };

    constructor (props) {
        super(props);
        this.state = {
            width: 0,
            activeIndex: 0
        };
    }

    componentDidMount () {
        const width = window.innerWidth;
        this.setState({ width });
    }

    setActiveIndex = (newIndex) => {
        const { banners } = this.props;

        if (newIndex > banners.length - 1) newIndex = 0;
        if (newIndex < 0) newIndex = banners.length - 1;

        this.setState({ activeIndex: newIndex });
    };

    handleArrowClick = (addValue) => {
        const { activeIndex } = this.state;
        this.setActiveIndex(activeIndex + addValue);
    };

    render () {
        const { langMap, banners } = this.props;
        const { width, activeIndex } = this.state;
        const left = -1 * (width * (activeIndex));
        const text = propOr('mainPage', {}, langMap);

        return (
            <section className={styles.slider}>
                <div className={styles.banners} style={{ left: left + 'px' }}>
                    {banners.map((banner, index) => {
                        return <div className={styles.bannerWrap} key={index}>
                            <img className={styles.banner} src={banner.path} alt="банер"/>
                        </div>;
                    })}
                </div>
                <div>
                    <div className={styles.arrowLeft} onClick={() => this.handleArrowClick(-1)}/>
                    <div className={styles.arrowRight} onClick={() => this.handleArrowClick(1)}/>
                </div>
                <div className={styles.bottomBlock}>
                    {banners[activeIndex].link &&
                    <a className={styles.text}
                        href={banners[activeIndex].link}>
                        <h2 className={styles.text}>
                            {text.slider}
                        </h2>
                    </a>}
                    <div className={styles.switch}>
                        {banners.map((banner, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => this.setActiveIndex(index)}
                                    className={classNames(styles.ellipse, { [styles.active]: index === activeIndex })}>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

export default connect(mapStateToProps)(Slider);

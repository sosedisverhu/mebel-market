import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import findIndex from '@tinkoff/utils/array/findIndex';
import propOr from '@tinkoff/utils/object/propOr';
import map from '@tinkoff/utils/array/map';
import propEq from '@tinkoff/utils/object/propEq';

import styles from './Slider.css';

const mapStateToProps = ({ application, data }) => {
    return {
        mainSlides: data.mainSlides,
        langMap: application.langMap
    };
};

class Slider extends Component {
    static propTypes = {
        mainSlides: PropTypes.array.isRequired,
        langMap: PropTypes.object.isRequired
    };

    static defaultProps = {
        mainSlides: []
    };

    constructor (props) {
        super(props);
        this.state = {
            banners: this.props.mainSlides,
            width: 0
        };
    }

    componentDidMount () {
        const width = this.banners.clientWidth;
        this.setState({ width });
    }

    getActiveIndex = (banners) => {
        let activeIndex = findIndex(propEq('active', true))(banners);
        if (activeIndex === -1) activeIndex = 0;
        return activeIndex;
    };

    changeBanners = (banners, addValue) => {
        const activeIndex = this.getActiveIndex(banners);
        const newBanners = banners.map(banner => {
            banner.active = false;
            return banner;
        });

        let newActiveIndex = activeIndex + addValue;
        if (newActiveIndex > banners.length - 1) newActiveIndex = 0;
        if (newActiveIndex < 0) newActiveIndex = banners.length - 1;
        newBanners[newActiveIndex].active = true;

        return newBanners;
    };

    handleArrowClick = (addValue) => {
        this.setState(state => ({ banners: this.changeBanners(state.banners, addValue) }));
    };

    handleElipseClick = (bannerIndex) => {
        const { banners } = this.state;
        const newBanners = map(banner => ({
            ...banner,
            active: false
        }), banners);

        newBanners[bannerIndex].active = true;

        this.setState({ banners: newBanners });
    };

    render () {
        const { langMap } = this.props;
        const { banners, width } = this.state;
        const activeIndex = this.getActiveIndex(banners);
        const left = -1 * (width * activeIndex);
        const text = propOr('main', {}, langMap);

        return (
            <section className={styles.slider}>
                <div className={styles.banners} ref={(banners) => {
                    this.banners = banners;
                }} style={{ left: left + 'px' }}>
                    {banners.map((banner, index) => {
                        return <div className={styles.bannerWrap} key={index}>
                            <img className={styles.banner} src={banner.path} alt="банер" />
                        </div>;
                    })}
                </div>
                <div>
                    <div className={styles.arrowLeft} onClick={() => this.handleArrowClick(-1)} />
                    <div className={styles.arrowRight} onClick={() => this.handleArrowClick(1)} />
                </div>
                <div className={styles.bottomBlock}>
                    <h2 className={styles.text}>{text.slider}</h2>
                    <div className={styles.switch}>
                        {banners.map((banner, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => this.handleElipseClick(index)}
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

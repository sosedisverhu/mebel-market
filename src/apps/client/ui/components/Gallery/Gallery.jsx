import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import noop from '@tinkoff/utils/function/noop';
import propOr from '@tinkoff/utils/object/propOr';

import styles from './Gallery.css';
import Draggable from '../Draggable/Draggable';
import PopupGallery from '../PopupGallery/PopupGallery';

const IGNORE_SWIPE_DISTANCE = 50;

const mapStateToProps = ({ application }) => {
    return {
        mediaWidth: application.media.width,
        langMap: application.langMap
    };
};

class Gallery extends Component {
    static propTypes = {
        photos: PropTypes.array.isRequired,
        mediaWidth: PropTypes.number.isRequired,
        location: PropTypes.object.isRequired,
        discount: PropTypes.number,
        langMap: PropTypes.object.isRequired,
        productAnimation: PropTypes.bool.isRequired
    };

    static defaultProps = {
        discount: 0
    };

    constructor (...args) {
        super(...args);

        this.maxSlideIndex = this.props.photos.length - 1;
        this.photoSliderTrack = React.createRef();
        this.state = {
            activeSlideIndex: 0,
            sliderLeft: 0,
            sliderWidth: 0,
            sliderHeight: 'auto',
            isPopup: false
        };
    }

    maxSlide = this.props.photos.length - 1;
    maxLeft = this.maxSlide * this.props.mediaWidth;

    handleDragStart = () => {
        this.startLeft = this.state.sliderLeft;
    };

    handleDragProcess = ({ delta: { client: { x: deltaX } } }) => {
        const nextSliderLeft = this.startLeft - deltaX;
        const { activeSlideIndex } = this.state;

        if (nextSliderLeft < 0 || nextSliderLeft > this.maxLeft) return;
        if (activeSlideIndex === this.maxSlideIndex && deltaX < 0) return;

        this.setState({
            sliderLeft: this.startLeft - deltaX
        });

        this.photoSliderTrack.current.style.transition = `none`;
        this.photoSliderTrack.current.style.left = `-${this.startLeft - deltaX}px`;
    };

    handleDragEnd = ({ delta: { client: { x: deltaX } } }) => {
        const { photos } = this.props;
        const { activeSlideIndex, sliderWidth } = this.state;
        const nextActiveSlideIndex = deltaX > 0 ? activeSlideIndex - 1 : activeSlideIndex + 1;

        if (Math.abs(deltaX) < IGNORE_SWIPE_DISTANCE || nextActiveSlideIndex === -1 || nextActiveSlideIndex === photos.length) {
            this.photoSliderTrack.current.style.left = `-${this.startLeft}px`;
            this.photoSliderTrack.current.style.transition = `left .2s ease-in-out, height .2s ease-in-out`;

            return this.setState({
                sliderLeft: sliderWidth * activeSlideIndex,
                activeSlideIndex
            });
        }

        this.startLeft = null;
        this.setState({
            activeSlideIndex: nextActiveSlideIndex,
            sliderLeft: nextActiveSlideIndex <= this.maxSlideIndex
                ? sliderWidth * nextActiveSlideIndex
                : 0,
            sliderHeight: nextActiveSlideIndex <= this.maxSlideIndex
                ? this.getSlideHeight(nextActiveSlideIndex)
                : this.getSlideHeight(0)
        });

        this.photoSliderTrack.current.style.transition = `left .5s ease-in-out, height .5s ease-in-out`;
        this.photoSliderTrack.current.style.left = `-${sliderWidth * nextActiveSlideIndex}px`;
    };

    handleImgClick = (index) => {
        const { sliderWidth } = this.state;
        const currentSlideHeight = this.getSlideHeight(index);

        this.setState({
            activeSlideIndex: index,
            sliderLeft: index * sliderWidth,
            sliderHeight: currentSlideHeight
        });
        this.photoSliderTrack.current.style.left = `-${index * sliderWidth}px`;
    };

    handleArrowClick = (index) => () => {
        const { photos } = this.props;

        if (index >= photos.length) index = 0;
        if (index < 0) index = photos.length - 1;

        this.handleImgClick(index);
    };

    setSliderSizes = (index) => {
        const { activeSlideIndex } = this.state;
        if (index === activeSlideIndex) {
            this.setState({
                sliderWidth: this.photoSliderTrack.current.clientWidth,
                sliderHeight: this.getSlideHeight(activeSlideIndex)
            });
        }
    };

    getSlideHeight = (index) => {
        return this.photoSliderTrack.current.children[index].offsetHeight;
    };

    componentDidMount () {
        const { activeSlideIndex } = this.state;
        const sliderWidth = this.photoSliderTrack.current.clientWidth;
        const currentSlideHeight = this.getSlideHeight(activeSlideIndex);

        this.setState({
            sliderWidth,
            sliderHeight: currentSlideHeight
        });
    }

    componentWillReceiveProps (nextProps) {
        const { activeSlideIndex } = this.state;
        const currentSlideHeight = this.getSlideHeight(activeSlideIndex);

        if (nextProps.mediaWidth !== this.props.mediaWidth) {
            const sliderWidth = this.photoSliderTrack.current.clientWidth;

            this.maxLeft = sliderWidth * this.maxSlide;
            this.setState({
                sliderLeft: sliderWidth * activeSlideIndex,
                activeSlideIndex,
                sliderWidth,
                sliderHeight: currentSlideHeight
            });

            this.photoSliderTrack.current.style.left = `-${activeSlideIndex * sliderWidth}px`;
        }

        if (this.props.location !== nextProps.location || this.props.location.pathname !== nextProps.location.pathname) {
            this.setState({
                activeSlideIndex: 0,
                sliderLeft: 0,
                sliderHeight: currentSlideHeight
            });
        }
    }

    handleChangePopup = () => {
        this.setState({ isPopup: !this.state.isPopup });
    };

    render () {
        const { photos, discount, mediaWidth, langMap, productAnimation } = this.props;
        const { sliderHeight, activeSlideIndex, isPopup } = this.state;
        const text = propOr('product', {}, langMap);

        return (
            <div className={classNames(styles.gallery, {
                [styles.animated]: productAnimation
            })}>
                {discount ? <div className={styles.discount}>-{discount}<span className={styles.percentage}>%</span></div> : null}
                <div className={styles.sliderWrap}>
                    <Draggable
                        onDragStart={mediaWidth < 1024 ? this.handleDragStart : noop}
                        onDrag={mediaWidth < 1024 ? this.handleDragProcess : noop}
                        onDragEnd={mediaWidth < 1024 ? this.handleDragEnd : noop}
                        allowDefaultAction
                        touchable
                    >
                        <div className={styles.mainImgWrap}>
                            <div className={styles.slider} ref={this.photoSliderTrack} style={{ height: sliderHeight }}>
                                {photos.map((img, i) => {
                                    return (
                                        <img className={styles.mainImg}
                                            src={img}
                                            alt="main image"
                                            onLoad={() => this.setSliderSizes(i)}
                                            key={i}/>
                                    );
                                })}
                            </div>
                        </div>
                    </Draggable>
                    {photos.length > 1 && <div className={styles.arrowLeft} onClick={this.handleArrowClick(activeSlideIndex - 1)}/>}
                    {photos.length > 1 && <div className={styles.arrowRight} onClick={this.handleArrowClick(activeSlideIndex + 1)}/>}
                    <div className={styles.tools}>
                        <div className={styles.toolOpen} onClick={this.handleChangePopup}>{text.onScreen}</div>
                    </div>
                </div>
                {photos.length > 1 && <div className={styles.additionalImgs}>
                    {
                        photos.map((img, index) => {
                            return (
                                <div key={index}
                                    onClick={() => this.handleImgClick(index)}
                                    className={classNames(styles.additionalImgWrap, {
                                        [styles.active]: index === activeSlideIndex
                                    })}>
                                    <img
                                        className={styles.additionalImg}
                                        src={img}
                                        alt="additional image"/>
                                </div>
                            );
                        })
                    }
                </div>}
                {isPopup && mediaWidth > 1000 && <PopupGallery
                    photos={photos}
                    activeSlideIndex={activeSlideIndex}
                    closePopup={this.handleChangePopup}
                />}
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Gallery));

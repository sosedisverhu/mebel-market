import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import classNames from 'classnames';

import Draggable from '../Draggable/Draggable';
import styles from './PopupGallery.css';

const IGNORE_SWIPE_DISTANCE = 50;

const mapStateToProps = ({ application }) => {
    return {
        mediaWidth: application.media.width
    };
};

class PopupGallery extends Component {
    static propTypes = {
        closePopup: PropTypes.func.isRequired,
        activeSlideIndex: PropTypes.number.isRequired,
        mediaWidth: PropTypes.number.isRequired,
        photos: PropTypes.array.isRequired
    };

    popup = React.createRef();
    photoSliderTrack = React.createRef();

    state = {
        activeSlideIndex: this.props.activeSlideIndex,
        sliderHeight: 0,
        sliderLeft: 0,
        sliderWidth: 0
    }

    componentDidMount () {
        disableBodyScroll(this.popup.current);

        const { activeSlideIndex } = this.state;
        const sliderWidth = this.photoSliderTrack.current.clientWidth;
        const currentSlideHeight = this.getSlideHeight(activeSlideIndex);

        this.setState({
            sliderWidth,
            sliderLeft: sliderWidth * activeSlideIndex,
            sliderHeight: currentSlideHeight
        });
    }

    componentWillUnmount () {
        clearAllBodyScrollLocks();
    }

    componentWillReceiveProps (nextProps) {
        const { activeSlideIndex } = this.state;
        const currentSlideHeight = this.getSlideHeight(activeSlideIndex);

        if (nextProps.mediaWidth !== this.props.mediaWidth) {
            const sliderWidth = this.photoSliderTrack.current.clientWidth;

            this.setState({
                sliderLeft: sliderWidth * activeSlideIndex,
                sliderWidth,
                sliderHeight: currentSlideHeight
            });
        }
    }

    handleDragStart = () => {
        this.startLeft = this.state.sliderLeft;
    };

    handleDragProcess = ({ delta: { client: { x: deltaX } } }) => {
        const { photos } = this.props;
        const { activeSlideIndex, sliderWidth } = this.state;
        const nextSliderLeft = this.startLeft - deltaX;
        const maxLeft = (photos.length - 1) * sliderWidth;

        if (nextSliderLeft < 0 || nextSliderLeft > maxLeft) return;
        if (activeSlideIndex === (photos.length - 1) && deltaX < 0) return;

        this.setState({
            sliderLeft: this.startLeft - deltaX
        });

        this.photoSliderTrack.current.style.transition = `none`;
    };

    handleDragEnd = ({ delta: { client: { x: deltaX } } }) => {
        const { photos } = this.props;
        const { activeSlideIndex, sliderWidth } = this.state;
        const nextActiveSlideIndex = deltaX > 0 ? activeSlideIndex - 1 : activeSlideIndex + 1;

        this.photoSliderTrack.current.style.transition = `left .5s ease-in-out, height .5s ease-in-out`;

        if (Math.abs(deltaX) < IGNORE_SWIPE_DISTANCE || nextActiveSlideIndex === -1 || nextActiveSlideIndex === photos.length) {
            return this.setState({
                sliderLeft: sliderWidth * activeSlideIndex,
                activeSlideIndex
            });
        }

        this.startLeft = null;
        this.setState({
            activeSlideIndex: nextActiveSlideIndex,
            sliderLeft: nextActiveSlideIndex <= photos.length - 1
                ? sliderWidth * nextActiveSlideIndex
                : 0,
            sliderHeight: nextActiveSlideIndex <= photos.length - 1
                ? this.getSlideHeight(nextActiveSlideIndex)
                : this.getSlideHeight(0)
        });
    };

    handleImgClick = (index) => {
        const { sliderWidth } = this.state;
        const currentSlideHeight = this.getSlideHeight(index);

        this.setState({
            activeSlideIndex: index,
            sliderLeft: index * sliderWidth,
            sliderHeight: currentSlideHeight
        });
    };

    getSlideHeight = (index) => {
        return this.photoSliderTrack.current.children[index].offsetHeight;
    };

    setSliderSizes = (index) => {
        const { activeSlideIndex } = this.state;
        const sliderWidth = this.photoSliderTrack.current.clientWidth;
        if (index === activeSlideIndex) {
            this.setState({
                sliderWidth,
                sliderHeight: this.getSlideHeight(activeSlideIndex)
            });
        }
    };

    handleArrowClick = (index) => () => {
        const { photos } = this.props;

        if (index >= photos.length) index = 0;
        if (index < 0) index = photos.length - 1;

        this.handleImgClick(index);
    };

    render () {
        const { photos } = this.props;
        const { activeSlideIndex, sliderHeight, sliderLeft } = this.state;

        return <div className={styles.root}>
            <div className={styles.cover} />
            <div className={styles.popupWrap}>
                <div className={styles.popup}>
                    <div className={styles.popupContent} ref={this.popup}>
                        <div className={styles.gallery}>
                            <div className={styles.sliderWrap}>
                                <Draggable
                                    onDragStart={this.handleDragStart}
                                    onDrag={this.handleDragProcess}
                                    onDragEnd={this.handleDragEnd}
                                    allowDefaultAction
                                    touchable
                                >
                                    <div className={styles.mainImages}>
                                        <div className={styles.slider} ref={this.photoSliderTrack} style={{ height: sliderHeight,
                                            left: -sliderLeft }}>
                                            {photos.map((img, i) => {
                                                return (<div className={styles.mainImgWrap} key={i}>
                                                    <img className={styles.mainImg}
                                                        src={img}
                                                        alt="main image"
                                                        onLoad={() => this.setSliderSizes(i)}/>
                                                </div>);
                                            })}
                                        </div>
                                    </div>
                                </Draggable>
                                <div className={styles.arrowLeft} onClick={this.handleArrowClick(activeSlideIndex - 1)}/>
                                <div className={styles.arrowRight} onClick={this.handleArrowClick(activeSlideIndex + 1)}/>
                            </div>
                        </div>
                        {photos.length > 1 && <div className={styles.additionalImgs}>
                            {photos.map((img, index) => {
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
                            })}
                        </div>}
                        <div onClick={this.props.closePopup} className={styles.close} />
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(PopupGallery);

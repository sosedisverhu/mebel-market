import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { connect } from 'react-redux';

import calcScrollbarWidth from 'scrollbar-width';
import Draggable from '../Draggable/Draggable.jsx';

import styles from './Carousel.css';
import propOr from '@tinkoff/utils/object/propOr';
import noop from '@tinkoff/utils/function/noop';

const TIME_TO_NEXT_SWITCHING = 8000;
const SWITCHING_DURATION = 800;
const IGNORE_SWIPE_DISTANCE = 50;
const IMAGE_HEIGHT_TO_WIDTH = 0.384;

const mapStateToProps = ({ application, data }) => {
    return {
        slides: data.slider[`slides_${application.lang}`] || [],
        mediaWidth: application.media.width,
        langMap: application.langMap,
        lang: application.lang
    };
};

class Carousel extends Component {
    static propTypes = {
        slides: PropTypes.array,
        mediaWidth: PropTypes.number,
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired
    };

    static defaultProps = {
        slides: []
    };

    constructor (...args) {
        super(...args);

        this.animation = false;
        this.maxSlideIndex = this.props.slides.length - 1;
        this.sliderTrack = React.createRef();
        this.state = {
            activeSlideIndex: 0,
            sliderLeft: 0,
            imageHeight: 0
        };
    }

    maxSlide = this.props.slides.length - 1;
    maxLeft = this.maxSlide * this.props.mediaWidth;

    componentWillReceiveProps (nextProps) {
        const scrollbarWidth = calcScrollbarWidth();

        if (nextProps.mediaWidth !== this.props.mediaWidth) {
            const { activeSlideIndex } = this.state;
            const sliderLeft = (nextProps.mediaWidth * activeSlideIndex) + scrollbarWidth * activeSlideIndex;

            this.sliderTrack.current.style.left = `-${sliderLeft}px`;
            this.sliderTrack.current.style.transition = `left ${SWITCHING_DURATION}ms`;
            this.maxLeft = (nextProps.mediaWidth * this.maxSlide) + scrollbarWidth * this.maxSlide;
            this.setState({
                sliderLeft: sliderLeft,
                imageHeight: nextProps.mediaWidth * IMAGE_HEIGHT_TO_WIDTH
            });
        }
    }

    handleDragStart = () => {
        this.startLeft = this.state.sliderLeft;
    };

    handleDragProcess = ({ delta: { client: { x: deltaX } } }) => {
        const nextSliderLeft = this.startLeft - deltaX;

        if (nextSliderLeft < 0 || nextSliderLeft > this.maxLeft) {
            return;
        }

        this.setState({
            sliderLeft: this.startLeft - deltaX
        });
        clearTimeout(this.sliderTimoutId);
        this.animation = true;
        this.sliderTrack.current.style.transition = `none`;
        this.sliderTrack.current.style.left = `-${this.startLeft - deltaX}px`;
    };

    handleDragEnd = ({ delta: { client: { x: deltaX } } }) => {
        const { slides } = this.props;
        const { activeSlideIndex } = this.state;
        const scrollbarWidth = calcScrollbarWidth();
        const nextActiveSlideIndex = deltaX > 0 ? activeSlideIndex - 1 : activeSlideIndex + 1;

        if (Math.abs(deltaX) < IGNORE_SWIPE_DISTANCE || nextActiveSlideIndex === -1 || nextActiveSlideIndex === slides.length) {
            this.sliderTrack.current.style.left = `-${this.startLeft}px`;
            this.sliderTrack.current.style.transition = `left ${SWITCHING_DURATION / 3}ms`;

            return this.setState({
                sliderLeft: (document.documentElement.clientWidth * activeSlideIndex) + scrollbarWidth * activeSlideIndex
            });
        }

        this.startLeft = null;
        this.setState({
            activeSlideIndex: nextActiveSlideIndex,
            sliderLeft: nextActiveSlideIndex <= this.maxSlideIndex
                ? (document.documentElement.clientWidth * nextActiveSlideIndex) + scrollbarWidth * nextActiveSlideIndex
                : 0
        });

        clearTimeout(this.sliderTimoutId);
        this.animation = true;
        this.sliderTrack.current.style.transition = `left ${SWITCHING_DURATION}ms`;
        this.sliderTrack.current.style.left = `-${(document.documentElement.clientWidth * nextActiveSlideIndex) + scrollbarWidth * nextActiveSlideIndex}px`;

        this.sliderTimoutId = setTimeout(() => {
            this.animation = false;
            this.setTimeoutToNextSlide();
        }, SWITCHING_DURATION);
    };

    componentDidMount () {
        this.startSlider();
        this.setState({
            imageHeight: window.innerWidth * IMAGE_HEIGHT_TO_WIDTH
        });
    }

    componentWillUnmount () {
        this.isUnmount = true;
    }

    startSlider = () => {
        this.setTimeoutToNextSlide();
    };

    setTimeoutToNextSlide = () => {
        const scrollbarWidth = calcScrollbarWidth();
        this.sliderTimoutId = setTimeout(() => {
            if (this.isUnmount) {
                return;
            }

            const { activeSlideIndex } = this.state;
            const nextActiveSlideIndex = activeSlideIndex + 1;

            this.setState({
                activeSlideIndex: nextActiveSlideIndex <= this.maxSlideIndex ? nextActiveSlideIndex : 0,
                sliderLeft: nextActiveSlideIndex <= this.maxSlideIndex
                    ? (document.documentElement.clientWidth * nextActiveSlideIndex) + scrollbarWidth * nextActiveSlideIndex
                    : 0
            });

            this.doSlideSwitch();
        }, TIME_TO_NEXT_SWITCHING);
    };

    doSlideSwitch = () => {
        const { activeSlideIndex } = this.state;
        const scrollbarWidth = calcScrollbarWidth();

        this.animation = true;
        this.sliderTrack.current.style.transition = `left ${SWITCHING_DURATION}ms`;
        this.sliderTrack.current.style.left = `-${(document.documentElement.clientWidth * activeSlideIndex) + scrollbarWidth * activeSlideIndex}px`;

        this.sliderTimoutId = setTimeout(() => {
            this.animation = false;
            this.setTimeoutToNextSlide();
        }, SWITCHING_DURATION);
    };

    stopSlider = () => clearTimeout(this.sliderTimoutId);

    setActiveSlide = (nextActiveSlideIndex) => () => {
        const { activeSlideIndex } = this.state;

        if (this.animation || activeSlideIndex === nextActiveSlideIndex) {
            return;
        }

        this.animation = true;
        this.stopSlider();

        const scrollbarWidth = calcScrollbarWidth();

        if (this.state.activeSlideIndex < nextActiveSlideIndex) {
            const hidedSlides = nextActiveSlideIndex - activeSlideIndex - 1;

            for (let i = activeSlideIndex + 1; i < nextActiveSlideIndex; i++) {
                this.sliderTrack.current.children[i].style.display = 'none';
            }

            this.sliderTrack.current.style.transition = `left ${SWITCHING_DURATION}ms`;
            this.sliderTrack.current.style.left = (nextActiveSlideIndex > this.maxSlideIndex)
                ? `0px`
                : `-${document.documentElement.clientWidth * (nextActiveSlideIndex - hidedSlides) + scrollbarWidth * (nextActiveSlideIndex - hidedSlides)}px`;
        } else {
            this.sliderTrack.current.style.transition = 'none';

            for (let i = nextActiveSlideIndex + 1; i < activeSlideIndex; i++) {
                this.sliderTrack.current.style.left =
                    `-${(document.documentElement.clientWidth * (nextActiveSlideIndex + 1)) + scrollbarWidth * (nextActiveSlideIndex + 1)}px`;
                this.sliderTrack.current.children[i].style.display = 'none';
            }

            setTimeout(() => {
                this.sliderTrack.current.style.transition = `left ${SWITCHING_DURATION}ms`;
                this.sliderTrack.current.style.left = `-${
                    (document.documentElement.clientWidth * nextActiveSlideIndex) + scrollbarWidth * nextActiveSlideIndex
                }px`;
            }, 0);
        }

        if (nextActiveSlideIndex > this.maxSlideIndex) nextActiveSlideIndex = 0;
        if (nextActiveSlideIndex < 0) nextActiveSlideIndex = this.maxSlideIndex;

        this.setState({
            activeSlideIndex: nextActiveSlideIndex,
            sliderLeft: nextActiveSlideIndex <= this.maxSlideIndex
                ? (document.documentElement.clientWidth * nextActiveSlideIndex) + scrollbarWidth * nextActiveSlideIndex
                : 0
        });

        setTimeout(() => {
            for (let i = 0; i < this.sliderTrack.current.children.length; i++) {
                this.sliderTrack.current.children[i].style.display = 'inline-block';
            }
            this.sliderTrack.current.style.transition = 'none';
            this.sliderTrack.current.style.left = `-${(document.documentElement.clientWidth * nextActiveSlideIndex) + scrollbarWidth * nextActiveSlideIndex}px`;

            this.animation = false;
            this.setTimeoutToNextSlide();
        }, SWITCHING_DURATION);
    };

    renderSlide = (slide, i) => <div className={styles.slide} key={i}>
        <div className={styles.imageWrapper} style={ this.props.mediaWidth > 768 ? { height: this.state.imageHeight } : {}}>
            <img
                className={styles.image} src={slide.path}
                alt={`slide${i}`}
            />
        </div>
        <div className={styles.contentWrapper}>
            {
                slide.title &&
                <div className={styles.content}>
                    <h2 className={styles.title}>{ slide.title }</h2>
                    <div className={styles.goldLine}/>
                </div>
            }
        </div>
    </div>;

    render () {
        const { slides, langMap, mediaWidth } = this.props;
        const { activeSlideIndex } = this.state;
        const text = propOr('mainPage', {}, langMap);
        const defaultText = 'Помочь с выбором';

        if (!slides.length) {
            return null;
        }

        return <div className={styles.carousel}>
            <Draggable
                onDragStart={mediaWidth < 1024 ? this.handleDragStart : noop}
                onDrag={mediaWidth < 1024 ? this.handleDragProcess : noop}
                onDragEnd={mediaWidth < 1024 ? this.handleDragEnd : noop}
                allowDefaultAction
                touchable
            >
                <div className={styles.sliderTrack} ref={this.sliderTrack}>
                    { slides.map((slide, i) => this.renderSlide(slide, i, slides)) }
                </div>
                {slides.length > 1 && <div className={styles.arrows}>
                    <div className={styles.arrowLeft} onClick={this.setActiveSlide(activeSlideIndex - 1)}/>
                    <div className={styles.arrowRight} onClick={this.setActiveSlide(activeSlideIndex + 1)}/>
                </div>}
                <div className={styles.bottomBlock}>
                    <a className={classNames(styles.text, { [styles.activeText]: !!slides[activeSlideIndex].link })}
                        href={slides[activeSlideIndex].link}
                        target={slides[activeSlideIndex].newTab ? '_blank' : '_self'} >{text.slider || defaultText}</a>
                    {slides.length > 1 && <div className={styles.dots}>
                        { slides.map((slide, i) =>
                            <div
                                className={classNames(styles.dot, { [styles.dotActive]: i === activeSlideIndex })}
                                onClick={this.setActiveSlide(i)}
                                key={i} />) }
                    </div>}
                </div>
            </Draggable>
            <a className={classNames(styles.text, styles.tablet, { [styles.activeText]: !!slides[activeSlideIndex].link })}
                href={slides[activeSlideIndex].link}
                target={slides[activeSlideIndex].newTab ? '_blank' : '_self'} >{text.slider || defaultText}</a>
        </div>;
    }
}

export default connect(mapStateToProps)(Carousel);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Gallery.css';
import Draggable from '../Draggable/Draggable';

const IGNORE_SWIPE_DISTANCE = 50;

const mapStateToProps = ({ application }) => {
    return {
        mediaWidth: application.media.width
    };
};

class Gallery extends Component {
    static propTypes = {
        photos: PropTypes.array.isRequired,
        mediaWidth: PropTypes.number.isRequired,
        location: PropTypes.object.isRequired,
        discount: PropTypes.number
    };

    static defaultProps = {
        discount: 0
    };

    constructor (...args) {
        super(...args);

        this.maxSlideIndex = this.props.photos.length - 1;
        this.photoSliderTrack = React.createRef();
        this.state = {
            activeImg: 0,
            activeSlideIndex: 0,
            sliderLeft: 0,
            sliderWidth: 0
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

        if (nextSliderLeft < 0 || nextSliderLeft > this.maxLeft || activeSlideIndex === this.maxSlideIndex) return;

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
            return this.setState({
                sliderLeft: sliderWidth * activeSlideIndex,
                activeImg: activeSlideIndex
            });
        }

        this.startLeft = null;
        this.setState({
            activeSlideIndex: nextActiveSlideIndex,
            sliderLeft: nextActiveSlideIndex <= this.maxSlideIndex
                ? sliderWidth * nextActiveSlideIndex
                : 0,
            activeImg: nextActiveSlideIndex
        });

        this.photoSliderTrack.current.style.transition = `left .5s ease-in-out`;
        this.photoSliderTrack.current.style.left = `-${sliderWidth * nextActiveSlideIndex}px`;
    };

    handleImgClick = (index) => {
        const { sliderWidth } = this.state;
        this.setState({ activeImg: index, activeSlideIndex: index, sliderLeft: index * sliderWidth });
        this.photoSliderTrack.current.style.left = `-${index * sliderWidth}px`;
    };

    handleArrowClick = direction => () => {
        const { activeImg, sliderWidth } = this.state;
        const newIndex = direction === 'left' ? activeImg - 1 : activeImg + 1;

        this.setState({
            activeImg: newIndex,
            sliderLeft: newIndex * sliderWidth
        });

        this.photoSliderTrack.current.style.left = `-${newIndex * sliderWidth}px`;
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.mediaWidth !== this.props.mediaWidth) {
            const { activeSlideIndex, sliderWidth } = this.state;

            this.setSliderWidth();
            this.maxLeft = sliderWidth * this.maxSlide;
            this.setState({
                sliderLeft: sliderWidth * activeSlideIndex,
                activeImg: activeSlideIndex
            });

            this.photoSliderTrack.current.style.left = `-${activeSlideIndex * sliderWidth}px`;
        }

        if (this.props.location !== nextProps.location || this.props.location.pathname !== nextProps.location.pathname) {
            this.setState({
                activeImg: 0,
                activeSlideIndex: 0,
                sliderLeft: 0
            });
        }
    }

    setSliderWidth = () => {
        this.setState({ sliderWidth: this.photoSliderTrack.current.clientWidth });
    }

    render () {
        const { photos, discount } = this.props;
        const { activeImg } = this.state;

        return (
            <div className={styles.gallery}>
                {discount ? <div className={styles.discount}>{discount}<span className={styles.percentage}>%</span></div> : null}
                <Draggable
                    onDragStart={this.handleDragStart}
                    onDrag={this.handleDragProcess}
                    onDragEnd={this.handleDragEnd}
                    allowDefaultAction
                    touchable
                >
                    <div className={styles.mainImgWrap}>
                        <div className={styles.slider}
                            ref={this.photoSliderTrack}>
                            {
                                photos.map((img, i) => {
                                    return (
                                        <img className={styles.mainImg}
                                            src={img}
                                            alt="main image"
                                            onLoad={this.setSliderWidth}
                                            key={i}/>
                                    );
                                })
                            }
                        </div>
                    </div>
                </Draggable>
                {photos.length > 1 && <div className={styles.additionalImgs}>
                    {
                        photos.map((img, index) => {
                            return (
                                <div key={index}
                                    onClick={() => this.handleImgClick(index)}
                                    className={classNames(styles.additionalImgWrap, {
                                        [styles.active]: index === activeImg
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
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Gallery));

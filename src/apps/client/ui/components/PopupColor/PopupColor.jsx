import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';

import Draggable from '../Draggable/Draggable';
import styles from './PopupColor.css';

const IGNORE_SWIPE_DISTANCE = 50;

const mapStateToProps = ({ application }) => {
    return {
        mediaWidth: application.media.width
    };
};

class PopupColor extends Component {
    static propTypes = {
        closePopup: PropTypes.func.isRequired,
        activeIndex: PropTypes.object.isRequired,
        mediaWidth: PropTypes.number.isRequired,
        colors: PropTypes.array.isRequired
    };

    popup = React.createRef();
    colorSliderTrack = React.createRef();

    state = {
        activeImg: 0,
        activeIndex: this.props.activeIndex,
        left: 0,
        widthSlide: 0
    }

    componentDidMount () {
        disableBodyScroll(this.popup.current);
    }

    componentWillUnmount () {
        clearAllBodyScrollLocks();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.mediaWidth !== this.props.mediaWidth) {
            this.setWidthAndLeft();
        }
    }

    setWidthAndLeft = () => {
        const { activeIndex } = this.state;
        const widthSlide = this.colorSliderTrack.current.clientWidth;
        const left = -widthSlide * activeIndex;

        this.setState({ widthSlide, left });
    }

    setActiveIndex = (newIndex) => {
        const { widthSlide } = this.state;
        const { colors } = this.props;

        if (newIndex > colors.length - 1) newIndex = 0;
        if (newIndex < 0) newIndex = colors.length - 1;

        const left = -widthSlide * newIndex;

        this.setState({ activeIndex: newIndex, left });
    };

    handleArrowClick = (addValue) => {
        const { activeIndex } = this.state;
        this.setActiveIndex(activeIndex + addValue);
    };

    handleDragStart = () => {
        this.startLeft = this.state.left;
    };

    handleDragProcess = ({ delta: { client: { x: deltaX } } }) => {
        this.setState({ left: this.startLeft + deltaX });
    };

    handleDragEnd = ({ delta: { client: { x: deltaX } } }) => {
        const { activeIndex, widthSlide } = this.state;
        let left = -widthSlide * activeIndex;

        if (Math.abs(deltaX) < IGNORE_SWIPE_DISTANCE) {
            this.colorSliderTrack.current.style.transition = `left .2s ease-in-out`;
            return this.setState({ left }, () => {
                setTimeout(() => {
                    this.colorSliderTrack.current.style.transition = `left .7s ease-in-out`;
                }, 200);
            });
        }

        if (deltaX > 0) return this.setActiveIndex(activeIndex - 1);

        this.setActiveIndex(activeIndex + 1);
    };

    render () {
        const { mediaWidth, colors } = this.props;
        const { activeIndex, left } = this.state;
        const hidden = colors.length <= 1;
        const activeColor = colors.find((color, i) => i === activeIndex);

        return <div className={styles.root}>
            <div className={styles.cover} onClick={this.props.closePopup()} />
            <div className={styles.popupWrap}>
                <div className={styles.popup}>
                    <div className={styles.popupContent} ref={this.popup} >
                        <h3 className={styles.title}>{activeColor.name}</h3>
                        <div className={styles.gallery}>
                            <Draggable
                                onDragStart={mediaWidth < 1024 ? this.handleDragStart : noop}
                                onDrag={mediaWidth < 1024 ? this.handleDragProcess : noop}
                                onDragEnd={mediaWidth < 1024 ? this.handleDragEnd : noop}
                                allowDefaultAction
                                touchable
                            >
                                <div className={styles.mainImgWrap}>
                                    <div className={styles.slider} ref={this.colorSliderTrack} style={{ left }}>
                                        {
                                            colors.map((color, i) => {
                                                return (
                                                    <img className={styles.mainImg}
                                                        src={color.file}
                                                        alt="main image"
                                                        onLoad={this.setWidthAndLeft}
                                                        key={i}/>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </Draggable>
                            <div className={classNames(styles.left, { [styles.hidden]: hidden })} onClick={() => this.handleArrowClick(-1)} />
                            <div className={classNames(styles.right, { [styles.hidden]: hidden })} onClick={() => this.handleArrowClick(1)} />
                            <p className={styles.numbers}>{`${activeIndex + 1} / ${colors.length}`}</p>
                            {!!activeColor.article && <p className={styles.article}>{activeColor.article}</p>}
                        </div>

                        <div onClick={this.props.closePopup()} className={styles.close} />
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(PopupColor);

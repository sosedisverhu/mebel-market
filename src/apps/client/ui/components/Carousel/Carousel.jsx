import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-slick';

import classNames from 'classnames';

import { connect } from 'react-redux';

import styles from './Carousel.css';

const IMAGE_HEIGHT_TO_WIDTH = 0.384;

function SampleNextArrow (props) {
    // eslint-disable-next-line react/prop-types
    const { onClick } = props;
    return (
        <div className={styles.arrowRight} onClick={onClick}/>
    );
}

function SamplePrevArrow (props) {
    // eslint-disable-next-line react/prop-types
    const { onClick } = props;
    return (
        <div className={styles.arrowLeft} onClick={onClick}/>
    );
}

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
        lang: PropTypes.string.isRequired,
        carouselAnimation: PropTypes.bool.isRequired
    };

    static defaultProps = {
        slides: []
    };

    constructor (...args) {
        super(...args);

        this.sliderTrack = React.createRef();
        this.state = {
            activeSlideIndex: 0,
            carouselAnimation: this.props.carouselAnimation
        };
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.carouselAnimation !== nextProps.carouselAnimation) {
            this.setState({ carouselAnimation: nextProps.carouselAnimation });
        }

        if (this.props.slides !== nextProps.slides) {
            if (nextProps.slides.length) {
                document.querySelector('.slick-track').style.display = 'flex';
                document.querySelector('.slick-track').style.height = '100%';
                document.querySelector('.slick-slider').style.height = document.documentElement.clientWidth * IMAGE_HEIGHT_TO_WIDTH + 'px';
                document.querySelector('.slick-list').style.height = '100%';
                const slides = document.querySelectorAll('.slick-slide');
                slides.forEach((item, i) => {
                    item.style.height = '100%';
                    item.children[0].style.height = '100%';
                });
            }
        }
    }

    componentDidMount () {
        if (this.props.slides.length) {
            document.querySelector('.slick-track').style.display = 'flex';
            document.querySelector('.slick-track').style.height = '100%';
            document.querySelector('.slick-slider').style.height = document.documentElement.clientWidth * IMAGE_HEIGHT_TO_WIDTH + 'px';
            document.querySelector('.slick-list').style.height = '100%';
            const slides = document.querySelectorAll('.slick-slide');
            slides.forEach((item, i) => {
                item.style.height = '100%';
                item.children[0].style.height = '100%';
            });
        }
    }

    renderSlide = (slide, i) => <div className={styles.slide} key={i}>
        <div className={styles.imageWrapper}>
            <img
                className={styles.image} src={slide.path}
                alt={`slide${i}`}
            />
        </div>
        <div className={styles.contentWrapper}>
            {
                (slide.title && slide.title !== 'false') &&
                <div className={styles.content}>
                    <h2 className={styles.title}>{ slide.title }</h2>
                    <div className={styles.goldLine}/>
                </div>
            }
        </div>
    </div>;

    render () {
        const { slides } = this.props;
        const { activeSlideIndex, carouselAnimation } = this.state;
        /* const text = propOr('mainPage', {}, langMap); */

        if (!slides.length) {
            return null;
        }

        const settings = {
            fade: false,
            dots: true,
            infinite: true,
            speed: 800,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 8000,
            pauseOnHover: true,
            swipeToSlide: true,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            appendDots: dots => (
                <div>
                    <ul className={styles.dots}> {dots} </ul>
                </div>
            ),
            customPaging: i => (
                <div className={classNames(styles.dot, {
                    [styles.dotActive]: activeSlideIndex === i
                })}/>
            ),
            beforeChange: (current, next) => this.setState({ activeSlideIndex: next }),
            responsive: [
                {
                    breakpoint: 880,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };

        return <div className={classNames(styles.carousel, {
            [styles.animated]: carouselAnimation
        })}>
            <Slider {...settings} ref={this.sliderTrack} className={styles.sliderTrack}>
                {
                    slides && slides.map((slide, i) => this.renderSlide(slide, i, slides))
                }
            </Slider>
            <div className={styles.bottomBlock}>
                <a className={classNames(styles.text, { [styles.activeText]: !!slides[activeSlideIndex].link })}
                    href={slides[activeSlideIndex].link}
                    target={slides[activeSlideIndex].newTab ? '_blank' : '_self'} >
                    {(slides[activeSlideIndex].name && slides[activeSlideIndex].name !== 'false') && slides[activeSlideIndex].name /* || text.slider */}
                </a>
            </div>
            <a className={classNames(styles.text, styles.tablet, { [styles.activeText]: !!slides[activeSlideIndex].link })}
                href={slides[activeSlideIndex].link}
                target={slides[activeSlideIndex].newTab ? '_blank' : '_self'} >
                {(slides[activeSlideIndex].name && slides[activeSlideIndex].name !== 'false') && slides[activeSlideIndex].name /* || text.slider */}
            </a>
        </div>;
    }
}

export default connect(mapStateToProps)(Carousel);

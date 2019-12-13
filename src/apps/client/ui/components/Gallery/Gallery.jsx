import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Gallery.css';

class Gallery extends Component {
    static propTypes = {
        photos: PropTypes.array.isRequired,
        discount: PropTypes.number
    };

    static defaultProps = {
        discount: 0
    };

    state = {
        activeImg: 0
    };

    handleImgClick = index => this.setState({ activeImg: index });

    render () {
        const { photos, discount } = this.props;
        const { activeImg } = this.state;
        return (
            <div className={styles.gallery}>
                {discount ? <div className={styles.discount}>{discount}%</div> : null}
                <div>
                    <img className={styles.mainImg} src={photos[activeImg]} width="681" height="400" alt="main image" />
                </div>
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

export default connect()(Gallery);

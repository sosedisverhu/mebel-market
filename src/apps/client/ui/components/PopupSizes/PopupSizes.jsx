import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './PopupSizes.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class PopupSizes extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        closePopup: PropTypes.func.isRequired,
        sizes: PropTypes.array.isRequired
    };

    popup = React.createRef();

    componentDidMount () {
        disableBodyScroll(this.popup.current);
    }

    componentWillUnmount () {
        clearAllBodyScrollLocks();
    }

    render () {
        const { sizes, langMap } = this.props;
        const text = propOr('product', {}, langMap);
        const c = 'ewr';

        return <div className={styles.root}>
            <div className={styles.cover} onClick={this.props.closePopup()} />
            <div className={styles.popupWrap}>
                <div className={styles.popup}>
                    <div className={styles.popupContent} ref={this.popup} >
                        <h3 className={styles.title}>{text.tableSizesTitle}</h3>
                        <div className={styles.tableWrap}>
                            <div className={styles.table}>
                                {sizes.map(size => {
                                    if (!size.tableSizes.length) return;

                                    return <div className={styles.rowWrap}>
                                        <div className={styles.rowTitle}>
                                            <h4>{c || text.tableSizesRowTitle}</h4>
                                            <h4>{c || ''}</h4>
                                        </div>
                                        <div className={styles.row}>
                                            <div className={styles.cellSize}>{size.name}</div>
                                            <div className={styles.columnComponents}>
                                                {size.tableSizes.map(component => {
                                                    return <div className={styles.rowComponent}>
                                                        <div className={styles.cellComponentName}>{component.name}</div>
                                                        <div className={styles.cellComponentSize}>{component.value}</div>
                                                    </div>;
                                                })}
                                            </div>
                                        </div>
                                    </div>;
                                })}
                            </div>
                        </div>
                        <div onClick={this.props.closePopup()} className={styles.close} />
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(PopupSizes);

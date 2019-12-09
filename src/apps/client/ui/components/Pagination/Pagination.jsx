import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Pagination.css';

class Pagination extends Component {
    static propTypes = {
        postsPerPage: PropTypes.number,
        totalPosts: PropTypes.number,
        currentPage: PropTypes.number,
        paginate: PropTypes.func,
        previousPage: PropTypes.func,
        nextPage: PropTypes.func
    };

    render () {
        const { postsPerPage, totalPosts, currentPage, paginate, previousPage, nextPage } = this.props;

        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <div className={styles.pagination}>
                <div className={styles.leftArrow} onClick={previousPage} id={currentPage}/>
                {pageNumbers.map(number =>
                    <button
                        className={classNames(styles.pageLink, { [styles.active]: currentPage === number })}
                        key={number}
                        id={number}
                        onClick={paginate}>
                        {number}
                    </button>
                )}
                <div className={styles.rightArrow} onClick={nextPage} id={currentPage}/>
            </div>
        );
    }
}

export default Pagination;

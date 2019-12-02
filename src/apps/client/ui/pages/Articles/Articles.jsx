import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import propOr from '@tinkoff/utils/object/propOr';
import styles from './Articles.css';

import Pagination from '../../components/Pagination/Pagination.jsx';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Articles extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    state = {
        currentPage: 1,
        postsPerPage: 6
    }

    paginate = (pageNumber) => this.setState({currentPage: Number(pageNumber.target.id)});

    render () {
        const { langMap } = this.props;
        const { currentPage, postsPerPage } = this.state;
        const text = propOr('articles', {}, langMap);

        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;

        const previousPage = (pageNumber) => {
            if (currentPage > 1) {
                this.setState({currentPage: Number(pageNumber.target.id) - 1});
            }
        };

        const nextPage = (pageNumber) => {
            if (currentPage < text.sections.length / postsPerPage) {
                this.setState({currentPage: Number(pageNumber.target.id) + 1});
            }
        };

        return (
            <section className={styles.articles}>
                <div className={styles.articlesContainer}>
                    {text.sections.slice(indexOfFirstPost, indexOfLastPost).map(article =>
                        <div className={styles.article} key={article.id}>
                            <Link className={styles.titleLink} to={`/articles/${article.id}`}>
                                <h1 className={styles.title}><span className={styles.titleUnderline}>{article.title}</span></h1>
                            </Link>
                            {article.introduction}
                            <div className={styles.moreInfo}>
                                <Link to={`/articles/${article.id}`}>
                                    <button className={styles.readMoreBtn}>{text.moreBtn}</button>
                                </Link>
                                <span className={styles.date}>{article.date}</span>
                            </div>
                        </div>
                    )}
                    {text.sections.length > postsPerPage &&
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={text.sections.length}
                            currentPage={currentPage}
                            paginate={this.paginate}
                            previousPage={previousPage}
                            nextPage={nextPage}
                        />
                    }
                </div>
            </section>
        );
    }
}

export default connect(mapStateToProps)(Articles);

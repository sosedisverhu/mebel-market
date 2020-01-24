import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Articles.css';

import Pagination from '../../components/Pagination/Pagination.jsx';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import ArticlePreview from '../../components/ArticlePreview/ArticlePreview';
import Sort from '../../components/Sort/Sort';
import propOr from '@tinkoff/utils/object/propOr';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        articles: data.articles,
        mediaWidth: application.media.width
    };
};

class Articles extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        articles: PropTypes.array.isRequired,
        mediaWidth: PropTypes.number.isRequired
    };

    state = {
        currentPage: 1,
        postsPerPage: 6
    };

    static getDerivedStateFromProps (props) {
        const { mediaWidth } = props;

        return mediaWidth <= 600
            ? { postsPerPage: 8 }
            : { postsPerPage: 6 };
    }

    paginate = pageNumber => this.setState({ currentPage: Number(pageNumber.target.id) }, () => {
        setTimeout(() => {
            window.scroll({ top: 10000000, left: 0 });
            setTimeout(() => {
                window.scroll({ top: 0, left: 0, behavior: 'smooth' });
            }, 50);
        }, 0);
    });

    previousPage = pageNumber => {
        const { currentPage } = this.state;
        if (currentPage > 1) {
            this.setState({ currentPage: Number(pageNumber.target.id) - 1 }, () => {
                setTimeout(() => {
                    window.scroll({ top: 10000000, left: 0 });
                    setTimeout(() => {
                        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                    }, 50);
                }, 0);
            });
        }
    };

    nextPage = pageNumber => {
        const { articles } = this.props;
        const { currentPage, postsPerPage } = this.state;
        if (currentPage < articles.length / postsPerPage) {
            this.setState({ currentPage: Number(pageNumber.target.id) + 1 }, () => {
                setTimeout(() => {
                    window.scroll({ top: 10000000, left: 0 });
                    setTimeout(() => {
                        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                    }, 50);
                }, 0);
            });
        }
    };

    render () {
        const { articles, langMap } = this.props;
        const { currentPage, postsPerPage } = this.state;
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        const text = propOr('articles', {}, langMap);

        return (
            <section className={styles.articles}>
                <Breadcrumbs noCategoryPage={text.searchResult.substring(0, text.searchResult.length - 1)}/>
                {articles.length
                    ? (<div className={styles.panelTopWrapper}>
                        <div className={styles.panelTop}>
                            <h3 className={styles.panelTopTitle}>{text.searchResult} {articles.length}</h3>
                            <Sort />
                        </div>
                    </div>)
                    : null}
                <div className={styles.articlesContainer}>
                    {articles.slice(indexOfFirstPost, indexOfLastPost).map(article =>
                        <ArticlePreview key={article.id} article={article} />
                    )}
                </div>
                {articles.length > postsPerPage &&
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={articles.length}
                        currentPage={currentPage}
                        paginate={this.paginate}
                        previousPage={this.previousPage}
                        nextPage={this.nextPage}
                    />
                }
            </section>
        );
    }
}

export default connect(mapStateToProps)(Articles);

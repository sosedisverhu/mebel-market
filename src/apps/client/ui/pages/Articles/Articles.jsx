import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import propOr from '@tinkoff/utils/object/propOr';
import getDateFormatted from '../../../../../../utils/getDateFormatted';
import Pagination from '../../components/Pagination/Pagination.jsx';
import styles from './Articles.css';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        articles: data.articles,
        mediaWidth: application.media.width
    };
};

class Articles extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        articles: PropTypes.array.isRequired,
        mediaWidth: PropTypes.number.isRequired
    };

    state = {
        currentPage: 1,
        postsPerPage: 6
    };

    static getDerivedStateFromProps(props) {
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

    previousPage = (pageNumber) => {
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

    nextPage = (pageNumber) => {
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
        const { langMap, lang, articles } = this.props;
        const { currentPage, postsPerPage } = this.state;
        const text = propOr('article', {}, langMap);
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;

        return (
            <section className={styles.articles}>
                <Breadcrumbs />
                <div className={styles.articlesContainer}>
                    {articles.slice(indexOfFirstPost, indexOfLastPost).map(article =>
                        <div className={styles.article} key={article.id}>
                            <Link className={styles.titleLink} to={`/articles/${article.alias}`}>
                                <h1 className={styles.title}><span className={styles.titleUnderline}>{article.texts[lang].name}</span></h1>
                            </Link>
                            <p>{article.texts[lang].preview}</p>
                            <div className={styles.moreInfo}>
                                <Link to={`/articles/${article.alias}`}>
                                    <button className={styles.readMoreBtn}>{text.moreBtn}</button>
                                </Link>
                                <span className={styles.date}>{getDateFormatted(article.date, lang) + ' ' + text.year}</span>
                            </div>
                        </div>
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

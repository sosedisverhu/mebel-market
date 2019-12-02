import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import propOr from '@tinkoff/utils/object/propOr';
import styles from './Article.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Article extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('articles', {}, langMap);
        const articleId = this.props.match.params.id - 1;
        const article = text.sections[articleId];

        return (
            <section className={styles.article}>
                <div className={styles.articleContainer}>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.title}>{article.title}</h1>
                        <span className={styles.date}>{article.date}</span>
                    </div>
                    <div className={styles.introduction}>
                        {article.introduction}
                    </div>
                    {article.content}
                </div>
            </section>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Article));

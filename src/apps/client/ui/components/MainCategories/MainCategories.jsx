import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './MainCategories.css';

const mapStateToProps = ({ application, data }) => {
    return {
        lang: application.lang,
        langRoute: application.langRoute,
        categories: data.categories
    };
};

class MainCategories extends Component {
    static propTypes = {
        lang: PropTypes.string.isRequired,
        langRoute: PropTypes.string.isRequired,
        categories: PropTypes.array
    };

    render () {
        const { lang, langRoute, categories } = this.props;

        return <div className={styles.categoriesWrap}>
            <div className={styles.categories}>
                {categories.map((category, i) =>
                    <Link className={styles.category} to={`${langRoute}/${category.alias}`} key={i}>
                        <div className={styles.imgWrap}>
                            <img className={styles.img} src={category.image} alt={category.texts[lang].name} />
                        </div>
                        <h3 className={styles.title}>{category.texts[lang].name}</h3>
                    </Link>
                )}
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(MainCategories);

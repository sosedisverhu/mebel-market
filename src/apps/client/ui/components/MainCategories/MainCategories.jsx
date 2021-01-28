import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './MainCategories.css';
import classNames from 'classnames';

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
        categories: PropTypes.array,
        categoriesAnimation: PropTypes.bool.isRequired
    };

    state = {
        categoriesAnimation: false
    };

    componentWillReceiveProps (nextProps, nextContext) {
        if (this.props.categoriesAnimation !== nextProps.categoriesAnimation) {
            this.setState({ categoriesAnimation: nextProps.categoriesAnimation });
        }
    }

    render () {
        const { lang, langRoute, categories } = this.props;
        const { categoriesAnimation } = this.state;

        return <div className={classNames(styles.categoriesWrap, {
            [styles.animated]: categoriesAnimation
        })}>
            <div className={styles.categories}>
                {categories.map((category, i) =>
                    <Link className={styles.category} to={`${langRoute}/${category.alias}`} key={i} style={{ transitionDelay: `${i * 0.25}s` }}>
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

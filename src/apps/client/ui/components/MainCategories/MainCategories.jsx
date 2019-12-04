import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './MainCategories.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class MainCategories extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('mainPage', {}, langMap);

        return <div className={styles.categoriesWrap}>
            <div className={styles.categories}>
                <a className={styles.category} href='#'>
                    <div className={styles.imgWrap}>
                        <img className={styles.img} src="/src/apps/client/ui/components/MainCategories/img/category1.jpg" alt={text.bedsTitle} />
                    </div>
                    <h3 className={styles.title}>{text.bedsTitle}</h3>
                </a>
                <a className={styles.category} href='#'>
                    <div className={styles.imgWrap}>
                        <img className={styles.img} src="/src/apps/client/ui/components/MainCategories/img/category2.jpg" alt={text.mattressesTitle} />
                    </div>
                    <h3 className={styles.title}>{text.mattressesTitle}</h3>
                </a>
                <a className={styles.category} href='#'>
                    <div className={styles.imgWrap}>
                        <img className={styles.img} src="/src/apps/client/ui/components/MainCategories/img/category3.jpg" alt={text.furnitureTitle} />
                    </div>
                    <h3 className={styles.title}>{text.furnitureTitle}</h3>
                </a>
                <a className={styles.category} href='#'>
                    <div className={styles.imgWrap}>
                        <img className={styles.img} src="/src/apps/client/ui/components/MainCategories/img/category4.jpg" alt={text.accessoriesTitle} />
                    </div>
                    <h3 className={styles.title}>{text.accessoriesTitle}</h3>
                </a>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(MainCategories);

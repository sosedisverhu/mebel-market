import React, { Component } from 'react';
import PropTypes from 'prop-types';

import uniqid from 'uniqid';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import reduceObj from '@tinkoff/utils/object/reduce';
import findIndex from '@tinkoff/utils/array/findIndex';

const materialStyles = {
    buttonRoot: {
        display: 'inline-flex',
        marginTop: '16px'
    }
};

class FormFieldButtonCopyFilters extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        schema: PropTypes.object,
        values: PropTypes.object,
        onChangeCustomFields: PropTypes.func,
        langs: PropTypes.array
    };

    static defaultProps = {
        schema: {}
    };

    handleClick = () => {
        const { values, langs, schema: { categories = [], allSubCategories = [] } } = this.props;
        const category = categories.find(category => category.id === values.categoryId);
        const subCategory = allSubCategories.find(subCategory => subCategory.id === values.subCategoryId);
        const newFields = {};
        const allFilters = {
            ru: [],
            ua: []
        };

        [category, subCategory].forEach(category => {
            category.filters.ru.forEach((categoryFilter, categoryFilterIndex) => {
                if (allFilters.ru.every(filter => filter.id !== categoryFilter.id)) {
                    const characteristicId = uniqid();
                    allFilters.ru.push({ ...categoryFilter, characteristicId });
                    allFilters.ua.push({ ...category.filters.ua[categoryFilterIndex], characteristicId });
                }
            });
        });

        for (const lang in langs) {
            let filters = allFilters[langs[lang]];
            const filterCharacteristics = reduceObj((filterCharacteristics, filterValue, filterName) => {
                if (filterName.search('subCategoryFilter-') || filterName.search('categoryFilter-')) {
                    let filterId = filterName;
                    filterId = filterId.replace('subCategoryFilter-', '');
                    filterId = filterId.replace('categoryFilter-', '');

                    const filterIndex = findIndex(filter => filter.id === filterId, filters);

                    if (filterIndex === -1) {
                        return filterCharacteristics;
                    }

                    if (filters[filterIndex].type !== 'checkbox') {
                        return filterCharacteristics;
                    }

                    const filterValueIndex = findIndex((option) => option.id === filterValue, filters[filterIndex].options);

                    if (filterValueIndex === -1) return filterCharacteristics;

                    return [
                        ...filterCharacteristics,
                        {
                            id: filters[filterIndex].characteristicId,
                            name: filters[filterIndex].name,
                            value: filters[filterIndex].options[filterValueIndex].name
                        }
                    ];
                }
                return filterCharacteristics;
            }, values[`${langs[lang]}_characteristics`], values);

            newFields[`${langs[lang]}_characteristics`] = filterCharacteristics;
        }

        this.props.onChangeCustomFields(newFields);
    };

    render () {
        const { classes, schema } = this.props;

        return <div className={classes.buttonRoot}>
            <Button
                variant='contained'
                color={schema.color || 'primary'}
                type={schema.type || 'button'}
                disabled={schema.disabled}
                onClick={this.handleClick}
            >
                { schema.label }
            </Button>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldButtonCopyFilters);

import forEachObj from '@tinkoff/utils/object/each';
import pathSet from 'lodash.set';
import path from '@tinkoff/utils/object/path';
import isArray from '@tinkoff/utils/is/array';
import isObject from '@tinkoff/utils/is/plainObject';

import getLangsValuesForArray from './getLangsValuesForArray';

export default function getLangsValuesForObject (resultPathValue, pathValue, value = {}, valueLangStructure, values, changesByLang) {
    forEachObj((propValue, propName) => {
        if (propValue === 'depend') {
            changesByLang = pathSet(changesByLang, [...resultPathValue, propName], path([...pathValue, propName], values));
        } else if (isObject(propValue)) {
            changesByLang = getLangsValuesForObject(
                [...resultPathValue, propName],
                [...pathValue, propName],
                value[propName],
                valueLangStructure[propName],
                values,
                changesByLang
            );
        } else if (isArray(propValue)) {
            changesByLang = getLangsValuesForArray(
                [...resultPathValue, propName],
                [...pathValue, propName],
                value[propName],
                valueLangStructure[propName],
                values,
                changesByLang
            );
        } else {
            changesByLang = pathSet(changesByLang, [...resultPathValue, propName], value[propName]);
        }
    }, valueLangStructure);

    return changesByLang;
}

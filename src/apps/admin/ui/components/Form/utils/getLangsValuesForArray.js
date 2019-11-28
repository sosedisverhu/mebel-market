import isObject from '@tinkoff/utils/is/plainObject';
import findIndex from '@tinkoff/utils/array/findIndex';
import pathSet from 'lodash.set';
import path from '@tinkoff/utils/object/path';

import getLangsValuesForObject from './getLangsValuesForObject';

export default function getLangsValuesForArray (resultPathValue, pathValue, value = [], valueLangStructure, values, changesByLang) {
    if (isObject(valueLangStructure[0])) {
        if (!valueLangStructure[0].id) {
            /* eslint-disable-next-line no-console */
            console.log('Пропущено обязательное свойство "id у объекта в массиве');
            return {};
        }

        changesByLang = pathSet(changesByLang, resultPathValue, []);

        value.forEach((valueItem, i) => {
            const valueItemId = valueItem.id;
            let valueItemIndex = findIndex(({ id }) => id === valueItemId, path(pathValue, values));
            valueItemIndex = valueItemIndex === -1 ? i : valueItemIndex;

            changesByLang =
                getLangsValuesForObject([...resultPathValue, i], [...pathValue, valueItemIndex], value[i], valueLangStructure[0], values, changesByLang);
        });

        return changesByLang;
    } else {
        /* eslint-disable-next-line no-console */
        console.log('Элементом массива должен быть объект с обязательным свойством "id"');
        return {};
    }
}

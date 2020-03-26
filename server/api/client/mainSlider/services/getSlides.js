import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getSliderQuery from '../queries/getSlider';

const SLIDER_ID = 'slider_id';

export default function getSlides (req, res) {
    getSliderQuery(SLIDER_ID)
        .then(([slider]) => {
            res.status(OKEY_STATUS_CODE).send(slider);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

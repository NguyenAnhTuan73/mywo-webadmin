import { merge } from 'lodash';
import moment from 'moment';

export const createFilterParam = (obj: any) => {
	let filter = obj;
	for (const key in filter) {
		if (moment.isMoment(filter[key])) {
			filter[key] = filter[key].format('X');
		}
		if (filter[key] === null || filter[key] == undefined || filter[key] === '') delete filter[key];
	}

	return merge({}, filter);
};

export const getNumberInParams = (
	param: string | null,
	option?: {
		minValue?: number;
		defaultValue?: number;
	},
): number => {
	const { minValue = 1, defaultValue = 1 } = option || {};
	if (!param || param === '' || isNaN(parseInt(param)) || parseInt(param) < minValue) return defaultValue;
	return parseInt(param);
};

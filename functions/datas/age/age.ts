import { BIRTH_MONTH, BIRTH_YEAR } from "../../../utils";

function getAgeData() {
	const c_year = new Date().getFullYear();
	const c_month = new Date().getMonth();
	const passed_month = c_month > BIRTH_MONTH ? 0 : -1;
	const elapsed_years = (c_year - BIRTH_YEAR) + passed_month;
	return (elapsed_years);
}

export default getAgeData;

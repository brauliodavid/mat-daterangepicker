
const thisMonthRange = () => {
	const y = new Date().getFullYear()
	const m = new Date().getMonth()

	let yearFrom, monthFrom, yearTo, monthTo
	yearFrom = y
	monthFrom = m
	yearTo = y
	monthTo = m + 1

	if(m === 11){
		yearTo = y+1
		monthTo = 0
	}

	return {
		name: 'This Month', 
		startDate: new Date(yearFrom, monthFrom, 1), 
		endDate: new Date(yearTo, monthTo, 0)
	}
}

const lastMonthRange = () => {
	const y = new Date().getFullYear()
	const m = new Date().getMonth()

	let yearFrom, monthFrom, yearTo, monthTo
	yearFrom = y
	monthFrom = m - 1
	yearTo = y
	monthTo = m
	
	if(m === 0){
		yearFrom = y-1
		monthFrom = 11
	}

	return {
		name: 'Last Month', 
		startDate: new Date(yearFrom, monthFrom, 1), 
		endDate: new Date(yearTo, monthTo, 0)
	}
}

const lastThreeMonthsRange = () => {
	const y = new Date().getFullYear()
	const m = new Date().getMonth()

	let yearFrom, monthFrom, yearTo, monthTo
	yearFrom = y
	monthFrom = m - 3 // current month - number desired
	yearTo = y
	monthTo = m
	
	if(monthFrom < 0){
		yearFrom = y-1
		monthFrom = 11 + 1 + monthFrom
	}

	return {
		name: 'Last 3 Months', 
		startDate: new Date(yearFrom, monthFrom, 1), 
		endDate: new Date(yearTo, monthTo, 0)
	}
}

export const DEFAULT_RANGES_DATES = [
	{name: 'Today', startDate: new Date(), endDate: new Date()},
	{name: 'Yesterday', startDate: new Date(new Date().setDate(new Date().getDate()-1)), endDate: new Date(new Date().setDate(new Date().getDate()-1))},
	{name: 'Last 7 Days', startDate: new Date(new Date().setDate(new Date().getDate()-6)), endDate: new Date()},
	{name: 'Last 30 Days', startDate: new Date(new Date().setDate(new Date().getDate()-29)), endDate: new Date()},
	thisMonthRange(),
	lastMonthRange(),
	lastThreeMonthsRange(),
]
/* @arr         spending array
 * @identifier  identify the name of the spending in the object
 * Sums the daily spending up and return the sum
*/
export const sum = (arr, identifier) => {
   return arr.reduce((last, next) => {
    if(next[identifier] !== undefined){
        return {[identifier]: (last[identifier] + next[identifier])};
    }else{
        return {[identifier]:last[identifier]};
    }
    
    }
    , {[identifier]: 0}); 
}

/* @arr         spending array
 * @identifier  identify the name of the spending in the object
 *
 * 
*/
export const cumulate = (arr, identifier) => {
    identifier = 'amount';
    let result = 0
    if(arr?.length > 0){
        let test =  arr.map( next => {
            result += next[identifier];
            return {...next, 'cumulate':result};
        });
        return test;
    }else{
        return [{'name': '', 'amount': 0, 'cumulate': result}];
    }
    
}

/* @arr         spending array
 * @identifier  identify the name of the spending in the object
 *
 * 
*/
export const cumulateDays = (arr, index, days) => {
    let len = arr.length;
    let sliced = [];
    if(len > 0 && days > 0){
       if( index > days ){
            sliced = arr.slice(index - days + 1, index + 1);
       } else {
            sliced = arr.slice(0, index);
       }
       return sliced.reduce((last, next) => {
            return [null, {cumulate: (last[1].cumulate + cumulate(next[1], 'amount')[next[1].length - 1].cumulate)}];
        }, [null,{cumulate: 0}]);
    }    
 }

/* @raw                 raw date object
 * @startDate:String    start date
 * @numDays:Number      number of days
 * filter the date array and return the sliced array
*/
export const filterSeqDate = (raw, startDate, numDays) => {
    let arr = Object.entries(raw);
    let len = arr.length;
    let startId = arr.findIndex(val => val[0] === startDate);
    let endId = -1;
    if(startId >= 0) {
        endId = startId + numDays;
        if(endId < len) {
            return Object.fromEntries(arr.slice(startId, endId));
        }else{
            return Object.fromEntries(arr.slice(startId, len));
        }
    }else{
        return null;
    }
}

/* @from    segment start point (x, y)
 * @to      segmetn end point (x, y)
 * @x       centerX for calculation
 * Calculate centerY by given segment
*/
export const getCenterY = (from, to, x) => {
    const m = (to.y - from.y) / (to.x  - from.x);
    const b = from.y - m * from.x;
    return m * x + b;
}

/* @date            date string
 * @locale          locale string
 * @localeOptions  locale options
 * Return formatted date
*/
export const localeDate = (date, locale, ...localeOptions) => {
    let newDate = new Date(date);
    return newDate.toLocaleDateString(locale, ...localeOptions);
}

/* @budget  daily budget
 * return budget arrays
*/
export const getBudgets = (budget) => [{name: 'today', amount: budget, days: 1, icon: 'AlertIcon'}, {name: 'past 7 days', amount: budget * 7, days: 7, icon: 'CheckIcon'}];
// export const getBudgets = (budget) => [{name: 'past 7 days', amount: budget * 7, days: 7, icon: 'CheckIcon'}];
/* @dailySpending
 *
*/
export const getSpendingIndicators = (raw, date, budgets) => {
    let arr = Object.entries(raw);
    return budgets.map((budget) => {
        let days = budget.days;
        // let diff = dailySpending - budget?.amount;
        let name = budget?.name;
        let index = arr.findIndex(val => val[0] === date);
        let diff = cumulateDays(arr, index, days)[1].cumulate - budget?.amount;
        if (diff >= 0) {
            return {icon: budget?.icon, amount: diff, short: 'over', text: `$${diff} over budget ${name}`};
        }else{
            return {icon: budget?.icon, amount: -diff, short: 'down', text: `$${-diff} down budget ${name}`};
        }
    })
}

export const getUser = () => 'Tiger';


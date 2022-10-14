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


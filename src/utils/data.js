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

const readline  = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

var list  = [
    'hello',
    'hell',
    'olleh',
    'ohell',
    'hilala',
]
var list = [
    {label: 'hello'},
    {label: 'appam'},
    {label: 'olleh'},
    {label: 'apple'},
    {label: 'ohell'},
    {label: 'hellollo'},
    {label: 'hello'},
    {label: 'banana'},
] 

var list  = {
    '1': 'ohell',
    '6': 'hell',
    '9': 'hello',
    '7': 'hilala',
    '5': 'hell',
}

var list  = {
    '1': {label:'Ohell'},
    '6': {label:'appam'},
    '9': {label:'hello'},
    '10': {label:'hello'},
    '7': {label:'apple'},
    '5': {label:'hehellollo'},
    '8': {label:'banana'},
}

const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    return track[str2.length][str1.length];
};

readline.question('Enter text : ',(str)=>{
    readline.close();
    if(str == ''){
        console.log('Empty input given, please give valid input.');
        return;
    }
    filterList(list, str, true, 'label', true)
});


const filterList = (list, str, isArray=true, keyToFilter=null, chooseFirstMatch=false)=>{
    if(str == ''){
        return list;
    }
    str = str.toLowerCase();
    console.log('Entered text is '+str);
    let time1 = new Date();
    let exactMatchFound = false;
    let newList = isArray?[]:{};
    if(isArray){
        let newArrayLength = 0;
        let scannedList = [];
        for(let index=0; index<list.length; index++){
            let diffLength = null;
            let str2 = null;
            if(keyToFilter){
                str2 = list[index][keyToFilter].toLowerCase();
            }
            else{
                str2 = list[index].toLowerCase();
            }
            
            diffLength = str2.indexOf(str);
            if(diffLength==-1){
                diffLength = levenshteinDistance(str, str2);
            }

            if(!exactMatchFound && diffLength==0 && str.length==str2.length){
                scannedList = [];
                scannedList[0] = {
                    data : list[index],
                    diff : diffLength,
                };
                exactMatchFound = true;
                if(chooseFirstMatch){
                    break;
                }
            }
            
            if((exactMatchFound && diffLength==0 && str.length==str2.length) || (!exactMatchFound && (diffLength < (str2.length/2)))){
                scannedList[newArrayLength] = {
                    data : list[index],
                    diff : diffLength,
                }
                newArrayLength++;
            }
            console.log(diffLength, list[index]);
        }
        scannedList.sort((a, b)=>{
            return a.diff - b.diff;
        })
        for(let index = 0;index < scannedList.length;index++){
            newList[index] = scannedList[index].data;
        }
        console.log(newList);
    }
    else{
        let newList = {};
        for(let key in list){
            let diffLength = null;
            let str2 = null;
            if(keyToFilter){
                str2 = list[key][keyToFilter].toLowerCase();
            }
            else{
                str2 = list[key].toLowerCase();
            }
            
            diffLength = str2.indexOf(str);
            if(diffLength==-1){
                diffLength = levenshteinDistance(str, str2);
            }

            if(!exactMatchFound && diffLength==0 && str.length==str2.length){
                newList = {};
                newList[key] = list[key];
                exactMatchFound = true;
                if(chooseFirstMatch){
                    break;
                }
            }
            
            if((exactMatchFound && diffLength==0 && str.length==str2.length) || (!exactMatchFound && (diffLength < (str2.length/2)))){
                newList[key] = list[key];
            }
            console.log(diffLength, list[key]);
        }
        console.log(newList);
    }
    
    let time2 = new Date();
    console.log('time taken => '+((time2-time1)/1000));
    return newList;
}

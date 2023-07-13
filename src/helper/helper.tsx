// To add pairs on list processing
function addMissingPairs(pairList: string[][]): string[][] {
    const missingPairs: string[][] = [];
  
    for (const pair of pairList) {
        const [first, second] = pair;
    
        // Check if the pair exists in the list
        const exists = pairList.some(([a, b]) => a === second && b === first);
    
        // If the pair doesn't exist, add it to the missing pairs list
        if (!exists) {
            missingPairs.push([second, first]);
        }
    }
  
    // Concatenate the original list with the missing pairs
    return pairList.concat(missingPairs);
}

export default addMissingPairs;
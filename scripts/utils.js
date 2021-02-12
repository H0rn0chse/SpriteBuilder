/**
 *
 * @param {Map} map
 * @param {*} searchValue
 */
export function getKeyByValue (map, searchValue) {
    let result = null;
    map.forEach((value, key) => {
        if (result) {
            return
        }
        if (value === searchValue) {
            result = key
        }
    })
    return result
}

export function getGuid () {
    return new Date().getTime()
}
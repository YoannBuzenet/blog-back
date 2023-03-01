
const buildFilterFromPossibleArrayQueryParam = (rawParam, name, sequelizeOperator) => {

    const isArray = rawParam.includes(',')

    let parsedParam = isArray ? rawParam.split(",") : rawParam

    let finalFilter;

    if (isArray) {
        const MultipleFilter = [];
        for (let i = 0; i < parsedParam.length; i++) {
            MultipleFilter.push({ [name]: parsedParam[i] })
        }
        finalFilter = { [sequelizeOperator.or]: MultipleFilter }

    }
    else {
        finalFilter = { [name]: rawParam }
    }

    return finalFilter;

}

module.exports = {
    buildFilterFromPossibleArrayQueryParam
}
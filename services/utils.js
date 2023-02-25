// https://gist.github.com/codeguy/6684588
const slugify = (...args) => {
    const value = args.join(' ')
  
    let slug=  value
        .normalize('NFD') // split an accented letter in the base letter and the acent
        .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
        .replace(/\s+/g, '-') // separator

    if(slug.endsWith("-")){
        slug = slug.substring(0, slug.length - 1)
    }    

    return slug;
  }

const generateRandomHexcode = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `#${randomColor}`;
}  
    
module.exports = {
    slugify,
    generateRandomHexcode
}
const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort('price')
    .select('name price')

  res.status(200).json({ nbHits: products.length, products })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query
  const queryObj = {}

  if (featured) {
    queryObj.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObj.company = company
  }
  if (name) {
    queryObj.name = { $regex: name, $options: 'i' }
  }

  if (numericFilters) {
    const operaterMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
    }
    const regEx = /\b(=|>|<|>=|<|<=|<>)\b/g
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operaterMap[match]}-`,
    )

    const options = ['price', 'rating']
    filters = filters.split(',').forEach((element) => {
      const [field, operaterMap, value] = element.split('-')
      if (options.includes(field)) {
        queryObj[field] = { [operaterMap]: Number(value) }
      }
    })
  }

  console.log('query obj: ', queryObj)

  let result = Product.find(queryObj)

  //sort
  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }

  // Pagination

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result - result.skip(skip).limit(limit)

  //23
  // if page is limited to 7 page:  page 1: 7 items  page: 2: 7 page 3: 7  page:4 2

  const products = await result

  res.status(200).json({ nbHits: products.length, products })
}

module.exports = { getAllProducts, getAllProductsStatic }

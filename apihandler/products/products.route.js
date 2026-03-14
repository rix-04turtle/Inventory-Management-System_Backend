import express from 'express'
import addProduct from './addProducts.js'
import fetchProduct from './fetchProducts.js'

const productRoutes = express()

productRoutes.post('/add', addProduct )

productRoutes.get('/view', fetchProduct)

// productRoutes.get('/view')
// BASE URL : /products

export default productRoutes

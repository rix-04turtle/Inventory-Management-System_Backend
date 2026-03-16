import express from 'express'
import addProduct from './addProducts.js'
import fetchProduct from './fetchProducts.js'
import fetchRetailerInventory from './fetchRetailerInventory.js'
import fetchAdminInventory from './fetchAdminInventory.js'
import authMiddleware from '../../middleware/authMiddleware.js'

const productRoutes = express()

productRoutes.post('/add', authMiddleware, addProduct )

productRoutes.get('/view', authMiddleware, fetchProduct)

productRoutes.get('/inventory', authMiddleware, fetchRetailerInventory)

productRoutes.get('/admin-inventory', authMiddleware, fetchAdminInventory)

// BASE URL : /products

export default productRoutes

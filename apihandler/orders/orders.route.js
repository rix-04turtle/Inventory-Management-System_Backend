import express from 'express'
import placeOrders from './placeOrder.js'
import viewOrders from './viewOrders.js'
import authMiddleware from '../../middleware/authMiddleware.js'

const orderRoutes = express()

orderRoutes.post('/place',authMiddleware, placeOrders )

orderRoutes.get('/view', viewOrders)



// productRoutes.get('/view')
// BASE URL : /orders

export default orderRoutes
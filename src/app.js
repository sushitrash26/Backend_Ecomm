import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

//Setup

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended: true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());


//Routes


import userRouter from './routes/user.routes.js'
import reviewRouter from './routes/review.routes.js'
import productRouter from './routes/products.routes.js'
import orderRouter from './routes/order.routes.js'
import orderItemsRouter from './routes/orderItems.routes.js'
import cartRouter from './routes/cart.routes.js'
import cartItemsRouter from './routes/cartItem.routes.js'
import categoryRouter from './routes/category.routes.js'
import addressRouter from './routes/address.routes.js'
import paymentRouter from './routes/payment.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/products",productRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/orders/items",orderItemsRouter)
app.use("/api/v1/carts",cartRouter)
app.use("/api/v1/carts/items", cartItemsRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/address",addressRouter)
app.use("/api/v1/payment",paymentRouter)

export {app}
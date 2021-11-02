import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
})

const Coupon = mongoose.model('Coupon', couponSchema)

export default Coupon
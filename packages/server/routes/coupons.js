import express from "express"
import { Coupon } from "../models"

const router = express.Router()

router.get("/create", async (req, res, next) => {
  const coupon = new Coupon({
    code: req.query.code,
    discount: req.query.discount,
  })

  try {
    await coupon.save()
    res.send(req.query)
  } catch (error) {
    next(new Error("Error Creating Coupon"))
  }
});

router.get("/verify", async (req, res, next) => {
  try {
    const verifiedCoupon = await Coupon.find({ code: req.query.code })
    if (verifiedCoupon.length > 0) {
      res.json(verifiedCoupon[0])
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(new Error("Error Validating Coupon"));
  }
});

module.exports = router;
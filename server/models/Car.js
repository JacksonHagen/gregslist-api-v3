import mongoose from 'mongoose'
const Schema = mongoose.Schema

export const CarSchema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, max: 2023, min: 1920 },
  price: { type: Number, required: true, min: 1 },
  description: { type: String, maxlength: 300 },
  imgUrl: { type: String, default: 'http://thiscatdoesnotexist.com' },
  color: { type: String },
  creatorId: { type: Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: true, toJSON: { virtuals: true } })

// VIRTUAL (similar to get) a fake property that is added by mongoose but is not stored in mongoDB
CarSchema.virtual('creator', {
  localField: 'creatorId',
  ref: 'Account',
  foreignField: '_id',
  justOne: true
})

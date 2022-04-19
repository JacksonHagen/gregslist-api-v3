import { dbContext } from '../db/DbContext.js'
import { BadRequest, Forbidden } from '../utils/Errors.js'

class CarsService {
  async getAll() {
    // dbContext is the database
    // Cars is the collection name
    // find is the method provided by mongoose to get data
    // the object passed is the "filter" where only data that has the same properties is retreived
    return await dbContext.Cars.find({}).populate('creator', 'picture name')
  }

  async getById(id) {
    const car = await dbContext.Cars.findById(id).populate('creator', 'picture name')
    if (!car) {
      throw new BadRequest('Invalid Id')
    }
    return car
  }

  async create(body) {
    const car = await dbContext.Cars.create(body)
    await car.populate('creator', 'picture name')
    return car
  }

  async edit(update) {
    const original = await this.getById(update.id)
    // check ownership
    if (original.creatorId.toString() !== update.creatorId) {
      throw new Forbidden('Invalid access')
    }
    // perform edit
    original.make = update.make || original.make
    original.model = update.model || original.model
    original.year = update.year || original.year
    original.price = update.price || original.price
    original.imgUrl = update.imgUrl || original.imgUrl
    original.color = update.color || original.color
    // save to db
    await original.save()
    return original
  }

  async remove(id, userId) {
    const car = await this.getById(id)
    // check ownership (the creatorId is BSON object, it must be turned into a string)
    if (car.creatorId.toString() !== userId) {
      throw new Forbidden('You are not allowed to delete things that are not yours')
    }
    await dbContext.Cars.findByIdAndDelete(id)
  }
}

export const carsService = new CarsService()

import { dbContext } from '../db/DbContext.js'
import { BadRequest, Forbidden, NotFound } from '../utils/Errors.js'

class HousesService {
  async getAllHouses() {
    return await dbContext.Houses.find({}).populate('creator', 'picture name')
  }

  async getHouseById(id) {
    const house = await dbContext.Houses.findById(id).populate('creator', 'picture name')
    if (!house) {
      throw new BadRequest('House not found')
    }
    return house
  }

  async createHouse(body) {
    const house = await dbContext.Houses.create(body)
    await house.populate('creator', 'picture name')
    return house
  }

  async editHouse(body) {
    const originalHouse = await this.getHouseById(body.id)
    if (originalHouse.creatorId.toString() !== body.creatorId) {
      throw new Forbidden('Ayo breaking other peoples stuff isnt nice.')
    }
    originalHouse.bedrooms = body.bedrooms || originalHouse.bedrooms
    originalHouse.bathrooms = body.bathrooms || originalHouse.bathrooms
    originalHouse.levels = body.levels || originalHouse.levels
    originalHouse.imgUrl = body.imgUrl || originalHouse.imgUrl
    originalHouse.year = body.year || originalHouse.year
    originalHouse.price = body.price || originalHouse.price
    originalHouse.description = body.description || originalHouse.description

    await originalHouse.save()
    return originalHouse
  }

  async removeHouse(id, userId) {
    const targetHouse = await this.getHouseById(id)
    if (targetHouse.creatorId.toString() !== userId) {
      throw new Forbidden('Ayo deleting other peoples stuff isnt nice.')
    }
    await dbContext.Houses.findByIdAndDelete(id)
  }
}

export const housesService = new HousesService()

import { Auth0Provider } from '@bcwdev/auth0provider'
import { housesService } from '../services/HousesService.js'
import BaseController from '../utils/BaseController.js'

export class HousesController extends BaseController {
  constructor() {
    super('api/houses')
    this.router
      .get('', this.getAllHouses)
      .get('/:id', this.getHouseById)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createHouse)
      .put('/:id', this.editHouse)
      .delete('/:id', this.removeHouse)
  }

  async getAllHouses(req, res, next) {
    try {
      const houses = await housesService.getAllHouses()
      res.send(houses)
    } catch (error) {
      next(error)
    }
  }

  async getHouseById(req, res, next) {
    try {
      const house = await housesService.getHouseById(req.params.id)
      res.send(house)
    } catch (error) {
      next(error)
    }
  }

  async createHouse(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const house = await housesService.createHouse(req.body)
      res.send(house)
    } catch (error) {
      next(error)
    }
  }

  async editHouse(req, res, next) {
    try {
      req.body.id = req.params.id
      req.body.creatorId = req.userInfo.id
      const house = await housesService.editHouse(req.body)
      res.send(house)
    } catch (error) {
      next(error)
    }
  }

  async removeHouse(req, res, next) {
    try {
      const userId = req.userInfo.id
      await housesService.removeHouse(req.params.id, userId)
      res.send('House removed')
    } catch (error) {
      next(error)
    }
  }
}

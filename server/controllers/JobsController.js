import { Auth0Provider } from '@bcwdev/auth0provider'
import { jobsService } from '../services/JobsService.js'
import BaseController from '../utils/BaseController.js'

export class JobsController extends BaseController {
  constructor() {
    super('api/jobs')
    this.router
      .get('', this.getAllJobs)
      .get('/:id', this.getJobById)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createJob)
      .put('/:id', this.editJob)
      .delete('/:id', this.removeJob)
  }

  async getAllJobs(req, res, next) {
    try {
      const jobs = await jobsService.getAllJobs()
      res.send(jobs)
    } catch (error) {
      next(error)
    }
  }

  async getJobById(req, res, next) {
    try {
      const job = await jobsService.getJobById(req.params.id)
      res.send(job)
    } catch (error) {
      next(error)
    }
  }

  async createJob(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const job = await jobsService.createJob(req.body)
      res.send(job)
    } catch (error) {
      next(error)
    }
  }

  async editJob(req, res, next) {
    try {
      const userId = req.userInfo.id
      req.body.id = req.params.id
      const job = jobsService.editJob(req.body, userId)
      res.send(job)
    } catch (error) {
      next(error)
    }
  }

  async removeJob(req, res, next) {
    try {
      const userId = req.userInfo.id
      await jobsService.removeJob(req.params.id, userId)
      res.send('Job Removed')
    } catch (error) {
      next(error)
    }
  }
}

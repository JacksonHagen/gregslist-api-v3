import { dbContext } from '../db/DbContext.js'
import { BadRequest, Forbidden } from '../utils/Errors.js'

class JobsService {
  async getAllJobs() {
    return await dbContext.Jobs.find({}).populate('creator', 'picture name')
  }

  async getJobById(id) {
    const job = await dbContext.Jobs.findById(id).populate('creator', 'picture name')
    if (!job) {
      throw new BadRequest('No job with this ID exists')
    }
    return job
  }

  async createJob(body) {
    const job = await dbContext.Jobs.create(body)
    await job.populate('creator', 'picture name')
    return job
  }

  async editJob(body, userId) {
    const originalJob = await this.getJobById(body.id)
    // @ts-ignore
    if (originalJob.creatorId.toString() !== userId) {
      throw new Forbidden('nonono you dont have access')
    }
    originalJob.company = body.company || originalJob.company
    originalJob.jobTitle = body.jobTitle || originalJob.jobTitle
    originalJob.hours = body.hours || originalJob.hours
    originalJob.rate = body.rate || originalJob.rate
    originalJob.description = body.description || originalJob.description

    await originalJob.save()
    return originalJob
  }

  async removeJob(id, userId) {
    const job = await this.getJobById(id)
    if (job.creatorId.toString() !== userId) {
      throw new Forbidden('nonono. not yours')
    }
    await dbContext.Jobs.findByIdAndDelete(id)
  }
}
export const jobsService = new JobsService()

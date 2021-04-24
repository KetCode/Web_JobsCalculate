const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils")
const Profile = require("../model/Profile")

module.exports = {
  create(req, res) {
    return res.render("job");
  },
  save(req, res) {
    const job = req.body;
    const jobs = Job.get()
    
    const lastId = jobs[jobs.length - 1].id || 0;
    /* const lastId = [
      Job.data.length - 1,
    ]; */ /* Job.data[Job.data.length - 1]?.id || 0 */ // [Job.data.length + 1]

    jobs.push({
      id: lastId + 1,
      name: job.name,
      "daily-hours": job["daily-hours"],
      "total-hours": job["total-hours"],
      created_at: Date.now(),
    });

    return res.redirect("/");
  },
  show(req, res) {
    const jobId = req.params.id;
    const jobs = Job.get()

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found");
    }

    const profile = Profile.get()

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },
  update(req, res) {
    const jobId = req.params.id;
    const jobs = Job.get()

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found");
    }

    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    const newJobs = jobs.map((job) => {
      if (Number(job.id) === Number(jobId)) job = updatedJob;
      return job;
    });

    Job.update(newJobs)

    return res.redirect("/job/" + jobId);
  },
  delete(req, res) {
    const jobId = req.params.id;

    Job.delete(jobId)

    return res.redirect("/");
  }
}

const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');

// Load jobs
const jobs = JSON.parse(fs.readFileSync('./jobs.json', 'utf8'));

jobs.forEach(job => {
  if (!cron.validate(job.schedule)) {
    console.error(`[ERROR] Invalid cron  expression: ${job.schedule} in job "${job.name}"`);
    return;
  }

  cron.schedule(job.schedule, async () => {
    console.log(`[${new Date().toISOString()}] Running job: ${job.name}`);
    try {
      const response = await axios.post(job.url); 
      console.log(`[SUCCESS] Job "${job.name}": ${response.status}`);
    } catch (err) {
      console.error(`[FAIL] Job "${job.name}":`, err.message);
    }
  });

  console.log(`[INFO] Scheduled job "${job.name}" with cron "${job.schedule}"`);
});
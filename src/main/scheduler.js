import { runWarming } from './warm_up_engine.js';

class Scheduler {
  constructor() {
    this.tasks = [];
  }

  scheduleTask(profileId, scenario, timeDeltaMs) {
    console.log(`Scheduling ${scenario} for ${profileId} in ${timeDeltaMs}ms`);
    setTimeout(() => {
      runWarming(profileId, scenario);
    }, timeDeltaMs);
  }
}

export const scheduler = new Scheduler();

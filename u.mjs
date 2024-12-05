// Utilities: sleep, schedule

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const schedule = f => Promise.resolve().then(f)

export { sleep, schedule }
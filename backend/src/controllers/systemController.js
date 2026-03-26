import os from 'os';

// CPU delta measurement — updated every second for accuracy
let prevCpuTimes = os.cpus().map(c => ({ ...c.times }));
let cpuPercent = 0;

setInterval(() => {
  const curr = os.cpus();
  let idleDelta = 0, totalDelta = 0;

  curr.forEach((cpu, i) => {
    const prev = prevCpuTimes[i];
    const idle = cpu.times.idle - prev.idle;
    const total = Object.keys(cpu.times).reduce(
      (sum, k) => sum + cpu.times[k] - prev[k],
      0
    );
    idleDelta += idle;
    totalDelta += total;
  });

  cpuPercent = totalDelta > 0 ? ((totalDelta - idleDelta) / totalDelta) * 100 : 0;
  prevCpuTimes = curr.map(c => ({ ...c.times }));
}, 1000);

export function getSystemStats(req, res) {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  res.json({
    cpu: parseFloat(cpuPercent.toFixed(1)),
    memory: {
      used: Math.round(usedMem / 1024 / 1024),
      total: Math.round(totalMem / 1024 / 1024),
    },
    uptime: Math.floor(os.uptime()),
    platform: os.platform(),
  });
}

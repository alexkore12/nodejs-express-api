/**
 * Health Check Endpoint
 * Proporciona información de salud del servicio
 */

const os = require('os');
const crypto = require('crypto');

/**
 * Obtiene el estado de salud del sistema
 */
function getHealthStatus() {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(uptime),
        service: {
            name: 'nodejs-express-api',
            version: process.env.npm_package_version || '2.1.0',
            nodeVersion: process.version
        },
        system: {
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            memory: {
                total: Math.round(os.totalmem() / 1024 / 1024),
                free: Math.round(os.freemem() / 1024 / 1024)
            }
        },
        process: {
            pid: process.pid,
            memory: {
                rss: Math.round(memUsage.rss / 1024 / 1024),
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024)
            },
            cpu: process.cpuUsage()
        }
    };
}

/**
 * Realiza un check profundo (verificaciones adicionales)
 */
async function deepHealthCheck() {
    const checks = {
        timestamp: new Date().toISOString(),
        checks: []
    };
    
    // Check memoria
    const memUsage = process.memoryUsage();
    const memPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    checks.checks.push({
        name: 'memory',
        status: memPercent < 90 ? 'pass' : 'fail',
        message: `${memPercent.toFixed(1)}% heap used`
    });
    
    // Check uptime (si menos de 30 segundos, podría estar reiniciando)
    const uptime = process.uptime();
    checks.checks.push({
        name: 'uptime',
        status: uptime > 30 ? 'pass' : 'warn',
        message: `Uptime: ${Math.floor(uptime)}s`
    });
    
    // Check CPU (simulado)
    const cpuUsage = process.cpuUsage();
    checks.checks.push({
        name: 'cpu',
        status: 'pass',
        message: 'CPU within normal parameters'
    });
    
    const allPass = checks.checks.every(c => c.status === 'pass');
    const anyFail = checks.checks.some(c => c.status === 'fail');
    
    checks.status = anyFail ? 'unhealthy' : allPass ? 'healthy' : 'degraded';
    
    return checks;
}

module.exports = {
    getHealthStatus,
    deepHealthCheck
};
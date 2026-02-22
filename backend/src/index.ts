import Fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';
import { supabase } from './supabaseClient.js';
import type { Mission, LiveTelemetry, MissionPlan } from './types.js'; 

const fastify = Fastify({ logger: true });
fastify.register(websocketPlugin);

// --- WebSocket Route ---
fastify.register(async function (server) {
  server.get('/ws/live', { websocket: true }, (connection, req) => {
    console.log('Client connected to live telemetry!');
    let currentBattery = 99.0;
    const missionStartTime = Date.now();

    // When a message arrives from the drone/client, attempt to persist it to Supabase
    connection.on('message', async (message: any) => {
      try {
        const payload = typeof message === 'string' ? JSON.parse(message) : JSON.parse(message.toString());

        // Map telemetry to mission_logs fields with safe defaults
        const name = payload.name || 'telemetry';
        const date = payload.date || new Date().toISOString();
        const duration = payload.duration ? String(payload.duration) : payload.flightTime || '0';
        const status = payload.status || 'live';
        const location = payload.location || (payload.gps ? `${payload.gps.lat},${payload.gps.lon}` : '');
        const gps_track = payload.gpsTrack || payload.gps ? [payload.gps] : [];
        const detected_sites = payload.detectedSites || [];

        await supabase.from('mission_logs').insert([{ name, date, duration, status, location, gps_track, detected_sites }]);
      } catch (err) {
        // Log and continue; we don't want telemetry persistence failures to break the socket
        fastify.log.error('Telemetry persist error: ' + String(err));
      }
    });

    connection.on('close', () => {
      console.log('Client disconnected.');
      clearInterval(interval);
    });

    // Keep sending test telemetry to connected clients (simulator)
    const interval = setInterval(() => {
      const elapsedMilliseconds = Date.now() - missionStartTime;
      const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
      const seconds = (totalSeconds % 60).toString().padStart(2, '0');
      const formattedFlightTime = `${minutes}:${seconds}`;
      currentBattery -= 0.01;

      const testTelemetry: LiveTelemetry = {
        gps: { lat: 14.531120 + (Math.random() - 0.5) * 0.001, lon: 121.057442 + (Math.random() - 0.5) * 0.001 },
        altitude: 47.9 + (Math.random() - 0.5) * 2,
        speed: 11.3 + (Math.random() - 0.5),
        roll: (Math.random() - 0.5) * 5,
        pitch: -5 + (Math.random() - 0.5) * 3,
        heading: 345 + (Math.random() - 0.5) * 5,
        signalStrength: -55,
        battery: { voltage: 16.8 * (currentBattery / 100), percentage: currentBattery < 0 ? 0 : currentBattery },
        satellites: 14,
        flightTime: formattedFlightTime,
        distanceFromHome: 4057 + totalSeconds,
        flightMode: 'Loiter',
        armed: true,
        verticalSpeed: -6.8 + (Math.random() - 0.5) * 0.2,
        breedingSiteDetected: false,
        currentBreedingSite: undefined,
        detectedSites: [],
        gpsTrack: [],
        modes: {
          angle: true,
          positionHold: true,
          returnToHome: false,
          altitudeHold: true,
          headingHold: false,
          airmode: true,
          surface: true,
          mcBraking: true,
          beeper: false,
        }
      };
      
      if (connection.readyState === 1) { // 1 means 'OPEN'
        connection.send(JSON.stringify(testTelemetry));
      } else {
        clearInterval(interval);
      }
    }, 1000); // Send data 1x per second
  });
});

// --- REST API Routes ---

// Root endpoint with API information
fastify.get('/', async (request, reply) => {
  return {
    name: 'GCS Backend API',
    version: '1.0.0',
    endpoints: {
      missions: {
        'GET /api/missions': 'Get all missions',
        'GET /api/missions/stats': 'Get mission statistics',
        'POST /api/missions': 'Create a new mission'
      },
      plans: {
        'GET /api/plans': 'Get all mission plans',
        'GET /api/plans/:id': 'Get a specific mission plan',
        'POST /api/plans': 'Create a new mission plan'
      },
      websocket: {
        'WS /ws/live': 'Live telemetry WebSocket'
      }
    }
  };
});

// GET all missions (for Flight Logs)
fastify.get('/api/missions', async (request, reply) => {
  try {
    const { data, error } = await supabase
      .from('mission_logs')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error' });
  }
});

// GET a single mission by id
fastify.get('/api/missions/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const { data, error } = await supabase.from('mission_logs').select('*').eq('id', parseInt(id, 10)).single();
    if (error) {
      // Supabase returns an error when not found
      return reply.code(404).send({ error: 'Mission not found' });
    }
    return data;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error' });
  }
});

// UPDATE a mission
fastify.put('/api/missions/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const payload = request.body as any;
    const { data, error } = await supabase.from('mission_logs').update(payload).eq('id', parseInt(id, 10)).select().single();
    if (error) throw error;
    return data;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error while updating mission' });
  }
});

// DELETE a mission
fastify.delete('/api/missions/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const { error } = await supabase.from('mission_logs').delete().eq('id', parseInt(id, 10));
    if (error) throw error;
    return { success: true };
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error while deleting mission' });
  }
});

// GET dashboard stats
fastify.get('/api/missions/stats', async (request, reply) => {
  try {
    const { data: durations, error: dErr } = await supabase
      .from('mission_logs')
      .select('duration');
    if (dErr) throw dErr;

    const { count, error: cErr } = await supabase
      .from('mission_logs')
      .select('id', { count: 'exact', head: true });
    if (cErr) throw cErr;

    let totalSeconds = 0;
    for (const row of durations || []) {
      const seconds = parseInt((row as any).duration, 10);
      if (!isNaN(seconds)) totalSeconds += seconds;
    }
    const hours = totalSeconds / 3600;
    return {
      totalFlights: count || 0,
      totalFlightTime: `${hours.toFixed(1)} Hours`
    };
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error' });
  }
});

// POST a new mission (for Flight Logs)
fastify.post('/api/missions', async (request, reply) => {
  try {
    const mission = request.body as { duration: number } & Omit<Mission, 'id' | 'duration'>;
    const { name, date, duration, status, location, gpsTrack, detectedSites } = mission;
    const durationString = String(duration); 
    const { data, error } = await supabase
      .from('mission_logs')
      .insert([{ name, date, duration: durationString, status, location, gps_track: gpsTrack, detected_sites: detectedSites }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error' });
  }
});


// ---
// NEW ROUTES FOR MISSION PLANNING
// ---

// POST a new MISSION PLAN (Save Plan)
fastify.post('/api/plans', async (request, reply) => {
  try {
    const plan = request.body as MissionPlan; 
    const { name, altitude, speed, waypoints } = plan;

    // Check for bad data
    if (!name || !waypoints || waypoints.length === 0) {
      return reply.code(400).send({ error: 'Invalid plan data. Name and waypoints are required.' });
    }

    const { data, error } = await supabase
      .from('mission_plans')
      .insert([{ name, altitude, speed, waypoints }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error while saving plan' });
  }
});

// GET all saved mission plans (for Load Plan modal)
fastify.get('/api/plans', async (request, reply) => {
  try {
    // Only fetch id and name for the list view
    const { data, error } = await supabase
      .from('mission_plans')
      .select('id, name')
      .order('id', { ascending: false });
    if (error) throw error;
    return data;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error while fetching plans' });
  }
});

// GET a *single* saved mission plan by its ID (when user clicks a plan)
fastify.get('/api/plans/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const { data, error } = await supabase
      .from('mission_plans')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single();
    if (error) {
      if ((error as any).code === 'PGRST116') return reply.code(404).send({ error: 'Plan not found' });
      throw error;
    }
    return data;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error while fetching plan' });
  }
});

// UPDATE a mission plan
fastify.put('/api/plans/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const payload = request.body as any;
    const { data, error } = await supabase.from('mission_plans').update(payload).eq('id', parseInt(id, 10)).select().single();
    if (error) throw error;
    return data;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error while updating plan' });
  }
});

// DELETE a mission plan
fastify.delete('/api/plans/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string };
    const { error } = await supabase.from('mission_plans').delete().eq('id', parseInt(id, 10));
    if (error) throw error;
    return { success: true };
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error while deleting plan' });
  }
});


// --- Start Server ---
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
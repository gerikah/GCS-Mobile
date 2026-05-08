import Fastify from 'fastify';
import cors from '@fastify/cors';
import { supabase } from './supabaseClient.js';
import type { Mission } from './types.js'; 

const fastify = Fastify({ logger: true });

// Enable CORS to allow mobile app and all clients to connect
await fastify.register(cors, {
  origin: '*', // This allows all devices (including your phone) to connect
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Helper to calculate duration in seconds
const calculateDuration = (start: string, end: string | null) => {
  if (!end) return 0;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return Math.max(0, Math.floor((endTime - startTime) / 1000));
};

// --- REST API Routes ---

fastify.get('/', async (request, reply) => {
  return {
    name: 'GCS Backend API (Updated for new Schema)',
    version: '1.1.0',
    endpoints: {
      missions: {
        'GET /api/missions': 'Get all flight sessions (mapped to missions)',
        'GET /api/missions/stats': 'Get mission statistics',
        'GET /api/missions/:id': 'Get detailed flight session'
      }
    }
  };
});

// GET all missions (Mapped from flight_sessions)
fastify.get('/api/missions', async (request, reply) => {
  try {
    // Optimized: Use a single query with joins via Supabase client
    const { data: sessions, error } = await supabase
      .from('flight_sessions')
      .select(`
        id,
        start_time,
        end_time,
        status,
        pilot:users(full_name),
        barangay:barangays(name, city:cities(name)),
        detections(id),
        spray_operations(id, true_area_scaled)
      `)
      .order('start_time', { ascending: false });

    if (error) throw error;

    const missions: Mission[] = (sessions as any[]).map((s) => {
        const totalDetections = s.detections?.length || 0;
        const totalSprays = s.spray_operations?.length || 0;
        const totalCoverage = s.spray_operations?.reduce((acc: number, curr: any) => acc + (curr.true_area_scaled || 0), 0) || 0;
        const sprayEfficiency = totalDetections > 0 ? (totalSprays / totalDetections) * 100 : 0;

        const durationSecs = calculateDuration(s.start_time, s.end_time);
        const locationName = s.barangay ? `${s.barangay.name}, ${s.barangay.city?.name || ''}` : 'Unknown';

        return {
            id: s.id,
            name: `Flight ${s.id.slice(0, 8)} - ${s.pilot?.full_name || 'Unknown Pilot'}`,
            date: new Date(s.start_time).toISOString(),
            duration: String(durationSecs),
            status: s.status === 'completed' ? 'Completed' : s.status === 'aborted' ? 'Interrupted' : 'In Progress',
            location: locationName,
            gpsTrack: [],
            detectedSites: [],
            coverageArea: totalCoverage,
            sprayEfficiency: sprayEfficiency,
            totalDetections: totalDetections,
            totalSprays: totalSprays
        };
    });

    return missions;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error' });
  }
});

// GET dashboard stats
fastify.get('/api/missions/stats', async (request, reply) => {
  try {
    // Optimized: Only select necessary columns
    const { data: sessions, error: sErr } = await supabase
      .from('flight_sessions')
      .select('start_time, end_time')
      .eq('status', 'completed');
    
    if (sErr) throw sErr;

    const totalFlights = sessions?.length || 0;
    let totalSeconds = 0;

    sessions?.forEach(s => {
        totalSeconds += calculateDuration(s.start_time, s.end_time);
    });

    const hours = totalSeconds / 3600;

    return {
      totalFlights,
      totalFlightTime: `${hours.toFixed(1)} Hours`
    };
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Database error' });
  }
});

// GET a single mission detail
fastify.get('/api/missions/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      // Optimized: Fetch everything in one go using joins
      const { data: s, error: sErr } = await supabase
        .from('flight_sessions')
        .select(`
          *,
          pilot:users(*),
          barangay:barangays(*, city:cities(*)),
          hardware_telemetry(latitude, longitude, altitude_lidar_m, battery_voltage, heading, is_armed, logged_at),
          detections(*, target_type:target_types(*)),
          spray_operations(true_area_scaled)
        `)
        .eq('id', id)
        .single();
  
      if (sErr || !s) return reply.code(404).send({ error: 'Session not found' });
  
      const telemetry = s.hardware_telemetry || [];
      const detections = s.detections || [];
      const sprays = s.spray_operations || [];

      const totalCoverage = sprays.reduce((acc: number, curr: any) => acc + (curr.true_area_scaled || 0), 0);
      const totalSprays = sprays.length;
      const totalDetections = detections.length;
      const sprayEfficiency = totalDetections > 0 ? (totalSprays / totalDetections) * 100 : 0;

      const durationSecs = calculateDuration(s.start_time, s.end_time);
      const locationName = s.barangay ? `${s.barangay.name}, ${s.barangay.city?.name || ''}` : 'Unknown';

      return {
          id: s.id,
          name: `Flight ${s.id.slice(0, 8)}`,
          date: new Date(s.start_time).toISOString(),
          duration: String(durationSecs),
          status: s.status === 'completed' ? 'Completed' : s.status === 'aborted' ? 'Interrupted' : 'In Progress',
          location: locationName,
          gpsTrack: telemetry.map((t: any) => ({ lat: t.latitude, lon: t.longitude })),
          detectedSites: detections.map((d: any) => ({
              type: d.water_confirmed ? 'Water Confirmed' : 'Detected',
              object: d.target_type?.label || 'Unknown',
              confidence: d.confidence,
              location: { lat: d.latitude, lon: d.longitude }
          })),
          coverageArea: totalCoverage,
          sprayEfficiency: sprayEfficiency,
          totalDetections: totalDetections,
          totalSprays: totalSprays,
          rawTelemetry: telemetry
      };
    } catch (err) {
      fastify.log.error(err);
      reply.code(500).send({ error: 'Database error' });
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

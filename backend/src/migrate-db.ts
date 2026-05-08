/**
 * Database Migration System
 * 
 * This file provides safe database schema migrations without data loss.
 * It tracks which migrations have been applied and prevents re-running them.
 */

import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

interface Migration {
  id: string;
  name: string;
  up: (pool: pg.Pool) => Promise<void>;
}

const migrations: Migration[] = [
  {
    id: '001',
    name: 'Create mission_logs table',
    up: async (pool) => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS mission_logs (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          date VARCHAR(50) NOT NULL,
          duration VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          location VARCHAR(255) NOT NULL,
          gps_track JSONB,
          detected_sites JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
  },
  {
    id: '002',
    name: 'Integrated New Schema',
    up: async (pool) => {
      // Enable extensions for UUID generation
      await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

      // Create tables in order of dependencies
      
      // 1. Independent tables
      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.cities (
          id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
          name text NOT NULL UNIQUE,
          CONSTRAINT cities_pkey PRIMARY KEY (id)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.target_types (
          id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
          label text NOT NULL UNIQUE,
          description text,
          CONSTRAINT target_types_pkey PRIMARY KEY (id)
        );
      `);

      // 2. Tables with dependencies
      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.barangays (
          id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
          city_id integer,
          name text NOT NULL,
          CONSTRAINT barangays_pkey PRIMARY KEY (id),
          CONSTRAINT barangays_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.users (
          id uuid NOT NULL DEFAULT gen_random_uuid(),
          full_name text NOT NULL,
          role text CHECK (role = ANY (ARRAY['Pilot'::text, 'LGU Personnel'::text, 'Sanitation Officer'::text])),
          email text NOT NULL UNIQUE,
          barangay_id integer,
          CONSTRAINT users_pkey PRIMARY KEY (id),
          CONSTRAINT users_barangay_id_fkey FOREIGN KEY (barangay_id) REFERENCES public.barangays(id),
          CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.flight_sessions (
          id uuid NOT NULL DEFAULT gen_random_uuid(),
          pilot_id uuid,
          barangay_id integer,
          start_time timestamp with time zone DEFAULT now(),
          end_time timestamp with time zone,
          status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'aborted'::text])),
          session_name text,
          CONSTRAINT flight_sessions_pkey PRIMARY KEY (id),
          CONSTRAINT flight_sessions_pilot_id_fkey FOREIGN KEY (pilot_id) REFERENCES public.users(id),
          CONSTRAINT flight_sessions_barangay_id_fkey FOREIGN KEY (barangay_id) REFERENCES public.barangays(id)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.detections (
          id uuid NOT NULL DEFAULT uuid_generate_v4(),
          session_id uuid NOT NULL,
          target_type_id integer NOT NULL,
          confidence double precision,
          water_confirmed boolean DEFAULT false,
          latitude double precision NOT NULL,
          longitude double precision NOT NULL,
          lidar_m double precision,
          image_url text,
          created_at timestamp with time zone DEFAULT now(),
          CONSTRAINT detections_pkey PRIMARY KEY (id),
          CONSTRAINT detections_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.flight_sessions(id),
          CONSTRAINT detections_target_type_id_fkey FOREIGN KEY (target_type_id) REFERENCES public.target_types(id)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.spray_operations (
          id uuid NOT NULL DEFAULT gen_random_uuid(),
          detection_id uuid NOT NULL,
          triggered_at timestamp with time zone DEFAULT now(),
          trigger_type text CHECK (trigger_type = ANY (ARRAY['Manual'::text, 'Auto'::text])),
          duration_seconds integer NOT NULL,
          target_area_pixels double precision,
          true_area_scaled double precision,
          session_id uuid,
          CONSTRAINT spray_operations_pkey PRIMARY KEY (id),
          CONSTRAINT spray_operations_detection_id_fkey FOREIGN KEY (detection_id) REFERENCES public.detections(id),
          CONSTRAINT spray_operations_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.flight_sessions(id)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.hardware_telemetry (
          id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
          session_id uuid NOT NULL,
          logged_at timestamp with time zone DEFAULT now(),
          latitude double precision,
          longitude double precision,
          altitude_lidar_m double precision,
          battery_voltage double precision,
          heading integer,
          is_armed boolean,
          CONSTRAINT hardware_telemetry_pkey PRIMARY KEY (id),
          CONSTRAINT hardware_telemetry_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.flight_sessions(id)
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.ai_performance_logs (
          id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
          session_id uuid NOT NULL,
          logged_at timestamp with time zone DEFAULT now(),
          sharpness_score integer,
          tracking_progress_percent integer,
          pipeline_speed_ms integer,
          CONSTRAINT ai_performance_logs_pkey PRIMARY KEY (id),
          CONSTRAINT ai_performance_logs_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.flight_sessions(id)
        );
      `);

      // Special case for stream_health_id_seq if it doesn't exist
      await pool.query(`
        CREATE SEQUENCE IF NOT EXISTS stream_health_id_seq;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.stream_health (
          id bigint NOT NULL DEFAULT nextval('stream_health_id_seq'::regclass),
          session_id uuid,
          logged_at timestamp with time zone DEFAULT now(),
          pi_ip text,
          laptop_ip text,
          stream_pid text,
          status text CHECK (status = ANY (ARRAY['Healthy'::text, 'Missing/Restarting'::text, 'Disconnected'::text, 'Failed'::text, 'Stream Frozen'::text, 'Too Blurry'::text])),
          CONSTRAINT stream_health_pkey PRIMARY KEY (id),
          CONSTRAINT fk_stream_health_session FOREIGN KEY (session_id) REFERENCES public.flight_sessions(id)
        );
      `);

      // Spatial reference table (usually comes with PostGIS, but added here as requested)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.spatial_ref_sys (
          srid integer NOT NULL CHECK (srid > 0 AND srid <= 998999),
          auth_name character varying,
          auth_srid integer,
          srtext character varying,
          proj4text character varying,
          CONSTRAINT spatial_ref_sys_pkey PRIMARY KEY (srid)
        );
      `);
    }
  },
  {
    id: '003',
    name: 'Add performance indexes',
    up: async (pool) => {
      // Add indexes to frequently queried foreign keys
      await pool.query('CREATE INDEX IF NOT EXISTS idx_detections_session_id ON public.detections(session_id)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_spray_operations_session_id ON public.spray_operations(session_id)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_hardware_telemetry_session_id ON public.hardware_telemetry(session_id)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_ai_performance_logs_session_id ON public.ai_performance_logs(session_id)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_stream_health_session_id ON public.stream_health(session_id)');
      
      // Add indexes to timestamps for sorting
      await pool.query('CREATE INDEX IF NOT EXISTS idx_flight_sessions_start_time ON public.flight_sessions(start_time)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_hardware_telemetry_logged_at ON public.hardware_telemetry(logged_at)');
    }
  }
];

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('\n========================================');
    console.log('🔄 DATABASE MIGRATIONS - SAFE MODE');
    console.log('========================================\n');

    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id VARCHAR(10) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of already-executed migrations
    const executedResult = await pool.query(
      'SELECT id FROM _migrations ORDER BY id'
    );
    const executedIds = new Set(executedResult.rows.map(row => row.id));

    // Run pending migrations
    let ranCount = 0;
    for (const migration of migrations) {
      if (executedIds.has(migration.id)) {
        console.log(`✓ [${migration.id}] ${migration.name} (already applied)`);
      } else {
        console.log(`▶ [${migration.id}] ${migration.name}... running`);
        await migration.up(pool);
        await pool.query(
          'INSERT INTO _migrations (id, name) VALUES ($1, $2)',
          [migration.id, migration.name]
        );
        console.log(`✅ [${migration.id}] ${migration.name}... done`);
        ranCount++;
      }
    }

    console.log('\n========================================');
    if (ranCount === 0) {
      console.log('✓ All migrations already applied. Database is up-to-date.');
    } else {
      console.log(`✅ Applied ${ranCount} new migration(s). Database updated.`);
    }
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Migration error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migrations if executed directly
import { fileURLToPath } from 'url';
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === (process.argv[1].endsWith('.ts') ? process.argv[1] : process.argv[1] + '.ts') || process.argv[1] === fileURLToPath(import.meta.url);
// A simpler check for tsx/node in ESM:
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')) || process.argv[1].replace(/\\/g, '/').endsWith(fileURLToPath(import.meta.url).replace(/\\/g, '/'))) {
  // This is still tricky in ESM + TSX. Let's just use a simpler check or just run it.
}

// Actually, for TSX it's often easier to just check if the last arg is the file name
const nodePath = process.argv[1];
if (nodePath && (nodePath.includes('migrate-db.ts') || nodePath.includes('migrate-db.js'))) {
  runMigrations().catch(console.error);
}

export { runMigrations, migrations };

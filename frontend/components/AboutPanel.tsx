import React from 'react';
import { Bot, Cpu, Database, GraduationCap, Map, Plane, Radio, Satellite, SprayCan, Users } from 'lucide-react';

const objectives = [
  'Provide an efficient mobile review interface for mosquito vector control operations.',
  'Help teams document hard-to-reach breeding sites and intervention results.',
  'Support data-driven intervention through mission logs, GPS tracks, and analytics.',
  'Keep the mobile companion focused on oversight while the drone remains controlled through dedicated flight systems.',
];

const features = [
  {
    title: 'Two-Stage AI Detection',
    body: 'YOLOv8 site detection followed by binary water verification for candidate breeding areas.',
    icon: Bot,
  },
  {
    title: 'Telemetry and Logging',
    body: 'Mission status, GPS mapping, and recorded operational details for review.',
    icon: Radio,
  },
  {
    title: 'Precision Deployment Records',
    body: 'Tracks operator-assisted larvicide deployment context for post-mission reporting.',
    icon: SprayCan,
  },
  {
    title: 'Geospatial Mapping',
    body: 'Leaflet-based map views for drone tracks and geotagged detection points.',
    icon: Map,
  },
  {
    title: 'Mission Analytics',
    body: 'Summaries and exportable reports for administrative review.',
    icon: Database,
  },
  {
    title: 'Avionics Context',
    body: 'Designed around field hardware including flight controller, GPS, LiDAR, and companion compute.',
    icon: Cpu,
  },
];

const teamMembers = ['Gerikah L. Alday', 'Alexa P. Babiera', 'Charles David P. Bernido', 'Catelyn Joy M. Morco'];

const stack = [
  ['Frontend', 'React, TypeScript, Tailwind CSS, Leaflet'],
  ['AI Model', 'YOLOv8 inference on the Ground Control Station'],
  ['Backend', 'Node.js, Fastify, PostgreSQL/Supabase'],
  ['Main Hardware', 'GEPRC MARK4, GEP-F405-HD V2, GEP-M10 GPS Module, LIDAR MicoAir MT-01, Radiomaster Pocket, Raspberry Pi 4'],
];

const Section: React.FC<{ title: string; eyebrow: string; children: React.ReactNode }> = ({ title, eyebrow, children }) => (
  <section className="rounded-md border border-white/10 bg-[#191d2d] p-3 shadow-sm">
    <div className="mb-3 border-b border-white/10 pb-2">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-gcs-primary">{eyebrow}</p>
      <h2 className="mt-1 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-white">{title}</h2>
    </div>
    {children}
  </section>
);

const AboutPanel: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto pr-1 animate-fade-in">
      <div className="space-y-3 pb-4">
        <div className="relative overflow-hidden rounded-md border border-white/10 bg-[#191d2d] p-4 shadow-sm">
          <div className="absolute right-0 top-0 h-24 w-24 bg-gcs-primary/10 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
          <div className="relative flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-gcs-primary/30 bg-[#0b0e17] text-gcs-primary shadow-[0_0_18px_rgba(255,69,79,0.28)]">
              <Plane className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-gcs-primary">Ground Control Station v1.0</p>
              <h1 className="mt-1 font-mono text-base font-black uppercase tracking-[0.16em] text-white">Smart Mosquito Control Drone</h1>
              <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-gray-400">
                A mobile companion interface for monitoring semi-autonomous UAV missions, reviewing AI-assisted mosquito breeding site detection, and exporting mission records.
              </p>
            </div>
          </div>
        </div>

        <Section eyebrow="Overview" title="Project Purpose">
          <p className="text-[12px] leading-relaxed text-gray-400">
            The Smart Mosquito Control Drone GCS supports a pilot-in-the-loop workflow: flight dynamics are handled through dedicated radio control while the GCS focuses on monitoring, AI inference context, GPS mapping, and operational documentation.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {objectives.map(objective => (
              <div key={objective} className="flex gap-2 rounded border border-white/10 bg-[#0e111b] p-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gcs-primary shadow-[0_0_10px_rgba(255,69,79,0.7)]" />
                <p className="text-[11px] leading-relaxed text-gray-400">{objective}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Capabilities" title="Key Features">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="rounded border border-white/10 bg-[#0e111b] p-3 transition-colors hover:border-gcs-primary/40 hover:bg-gcs-primary/10">
                  <span className="mb-2 flex h-8 w-8 items-center justify-center rounded border border-gcs-primary/25 bg-gcs-primary/10 text-gcs-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-[12px] font-bold text-white">{feature.title}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-400">{feature.body}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <div className="grid gap-3 lg:grid-cols-2">
          <Section eyebrow="Team" title="Development Team">
            <div className="space-y-3 text-[11px] text-gray-400">
              <div className="flex gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-gcs-primary" />
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-gcs-primary">Developed By</p>
                  <div className="mt-1 grid gap-1 text-white sm:grid-cols-2">
                    {teamMembers.map(member => <p key={member}>{member}</p>)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 border-t border-white/10 pt-3">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-gcs-primary" />
                <div>
                  <p className="font-semibold text-white">Polytechnic University of the Philippines - Sta. Mesa</p>
                  <p>College of Engineering, Computer Engineering Department</p>
                  <p className="mt-1">Bachelor of Science in Computer Engineering</p>
                  <p className="mt-1 font-semibold text-white">Adviser: Dr. Luisito L. Lacatan</p>
                </div>
              </div>
            </div>
          </Section>

          <Section eyebrow="System" title="Technical Stack">
            <div className="space-y-2">
              {stack.map(([label, value]) => (
                <div key={label} className="rounded border border-white/10 bg-[#0e111b] p-2.5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-gcs-primary">{label}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-400">{value}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <Section eyebrow="Credits" title="Acknowledgments">
          <p className="text-[12px] leading-relaxed text-gray-400">
            The team extends sincere gratitude to mentors, the Polytechnic University of the Philippines, local government units, CAAP, FPA, and the technical contributors who guided the project.
          </p>
          <p className="mt-3 text-[11px] font-semibold leading-relaxed text-gray-300">
            This journey would not have been possible without the technical excellence and unwavering support of our subject matter experts:
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {['Sir Peter Geronimo (PinoyFPV)', 'Sir Sherwin Esguerra'].map(name => (
              <div key={name} className="rounded border border-gcs-primary/25 bg-gcs-primary/10 p-2.5">
                <p className="text-[11px] font-semibold text-white">{name}</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-gray-400">Thank you for the technical expertise, mentorship, and guidance that helped shape the project.</p>
              </div>
            ))}
          </div>
        </Section>

        <div className="flex flex-col gap-2 rounded-md border border-white/10 bg-[#0e111b] p-3 text-[11px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Satellite className="h-4 w-4 text-gcs-primary" />
            <p className="font-semibold text-white">Smart Mosquito Control Drone Project</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono uppercase tracking-[0.12em]">
            <span>Version 1.0.0</span>
            <span>Release 2026</span>
            <span>smartdroneproject@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;

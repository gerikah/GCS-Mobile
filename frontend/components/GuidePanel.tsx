import React from 'react';
import { BookOpen, FileDown, LockKeyhole, Radar, ShieldCheck } from 'lucide-react';

interface GuideItem {
  id: string;
  title: string;
  body: string;
}

const guideSections: Array<{
  eyebrow: string;
  title: string;
  icon: React.ElementType;
  items: GuideItem[];
}> = [
  {
    eyebrow: '01 / Access',
    title: 'Administrative Access Control',
    icon: LockKeyhole,
    items: [
      {
        id: '1.1',
        title: 'Secure Authentication',
        body: 'Access is restricted through the authentication screen so mission data, logs, and administrative review tools stay available only to authorized personnel.',
      },
    ],
  },
  {
    eyebrow: '02 / Scope',
    title: 'Functional Scope',
    icon: Radar,
    items: [
      {
        id: '2.1',
        title: 'Monitoring Status',
        body: 'GCS-Mobile is a monitoring companion app. Flight dynamics and larvicide payload activation remain outside this mobile interface.',
      },
      {
        id: '2.2',
        title: 'Data Management',
        body: 'Use the Analytics Engine and Flight Log Repository to review mission performance, detected sites, flight duration, and historical operating data.',
      },
    ],
  },
  {
    eyebrow: '03 / Reports',
    title: 'Documentation and Reporting',
    icon: FileDown,
    items: [
      {
        id: '3.1',
        title: 'Report Generation',
        body: 'Export flight logs and analytics reports in portable formats for review, documentation, and field operation records.',
      },
    ],
  },
];

const GuidePanel: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto pr-1 animate-fade-in">
      <div className="space-y-3 pb-4">
        <div className="relative overflow-hidden rounded-md border border-white/10 bg-[#191d2d] p-4 shadow-sm">
          <div className="absolute right-0 top-0 h-20 w-20 bg-gcs-primary/10 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
          <div className="relative flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-gcs-primary/30 bg-[#0b0e17] text-gcs-primary shadow-[0_0_18px_rgba(255,69,79,0.28)]">
              <BookOpen className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-gcs-primary">Operator Reference</p>
              <h1 className="mt-1 font-mono text-base font-black uppercase tracking-[0.18em] text-white">GCS-M Guide Panel</h1>
              <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-gray-400">
                Quick operating notes for the mobile companion app, focused on secure access, mission review, and report extraction.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {guideSections.map(section => {
            const Icon = section.icon;

            return (
              <section key={section.title} className="rounded-md border border-white/10 bg-[#191d2d] p-3 shadow-sm">
                <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-gcs-primary/25 bg-gcs-primary/10 text-gcs-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gcs-primary">{section.eyebrow}</p>
                    <h2 className="truncate font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white">{section.title}</h2>
                  </div>
                </div>

                <div className="space-y-2">
                  {section.items.map(item => (
                    <div key={item.id} className="rounded border border-white/10 bg-[#0e111b] p-3">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="rounded border border-gcs-primary/30 bg-gcs-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gcs-primary">
                          {item.id}
                        </span>
                        <h3 className="text-[12px] font-bold text-white">{item.title}</h3>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-400">{item.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="rounded-md border border-gcs-primary/25 bg-gcs-primary/10 p-3">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gcs-primary" />
            <p className="text-[11px] leading-relaxed text-gray-300">
              Field operations should still follow local safety procedures and mission authority protocols. This panel is a reference layer for the mobile app only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePanel;

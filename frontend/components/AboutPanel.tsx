import React from 'react';

const AboutPanel: React.FC = () => {
    return (
        <div className="space-y-4 animate-fade-in h-full overflow-y-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-gcs-primary from-gcs-primary-dark p-4 rounded-xl shadow-lg text-white">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold">Smart Mosquito Control Drone</h1>
                        <p className="text-[11px] opacity-90">Ground Control Station v1.0</p>
                    </div>
                </div>
            </div>

            {/* Project Overview */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <h2 className="text-sm font-bold text-gcs-text-dark dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    Project Overview
                </h2>
                <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    The Smart Mosquito Control Drone GCS is a monitoring and control interface designed to manage a semi-autonomous UAV for mosquito larval detection and larvicide deployment. This system combines advanced AI detection with real-time telemetry to provide an efficient solution for mosquito vector control.
                </p>
            </div>

            {/* Key Features */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <h2 className="text-sm font-bold text-gcs-text-dark dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-2">
                    <div className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gcs-primary text-sm mt-0.5">🤖</span>
                        <div>
                            <h3 className="font-semibold text-sm text-gcs-text-dark dark:text-white">YOLOv8 AI Detection</h3>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400">Advanced mosquito larvae identification system</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gcs-primary text-sm mt-0.5">📡</span>
                        <div>
                            <h3 className="font-semibold text-sm text-gcs-text-dark dark:text-white">Real-time Telemetry</h3>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400">Live GPS mapping and drone status monitoring</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gcs-primary text-sm mt-0.5">💊</span>
                        <div>
                            <h3 className="font-semibold text-sm text-gcs-text-dark dark:text-white">Automated Dispenser</h3>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400">Precision larvicide deployment control</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gcs-primary text-sm mt-0.5">🗺️</span>
                        <div>
                            <h3 className="font-semibold text-sm text-gcs-text-dark dark:text-white">Mission Planning</h3>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400">Complete setup and summary interface</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gcs-primary text-sm mt-0.5">📊</span>
                        <div>
                            <h3 className="font-semibold text-sm text-gcs-text-dark dark:text-white">Data Analytics</h3>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400">Comprehensive logging and visualization</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gcs-primary text-sm mt-0.5">🎮</span>
                        <div>
                            <h3 className="font-semibold text-sm text-gcs-text-dark dark:text-white">Live Mission Control</h3>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400">Real-time mission monitoring and control</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Objectives */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <h2 className="text-sm font-bold text-gcs-text-dark dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    Objectives & Purpose
                </h2>
                <div className="space-y-1.5 text-[11px] text-gray-700 dark:text-gray-300">
                    <div className="flex items-start gap-2">
                        <span className="text-gcs-primary mt-0.5">•</span>
                        <p>To provide an efficient and automated solution for mosquito vector control</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gcs-primary mt-0.5">•</span>
                        <p>Supporting public health efforts in reducing dengue and malaria outbreaks</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gcs-primary mt-0.5">•</span>
                        <p>Enabling proactive mosquito breeding site detection and treatment</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gcs-primary mt-0.5">•</span>
                        <p>Improving safety and efficiency compared to manual inspection methods</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Development Team */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm font-bold text-gcs-text-dark dark:text-white mb-2 flex items-center gap-2">
                        <span className="text-lg">👥</span>
                        Development Team
                    </h2>
                    <div className="space-y-1.5 text-[11px]">
                        <div>
                            <p className="font-semibold text-gcs-primary">Developed by:</p>
                            <p className="text-gray-700 dark:text-gray-300">Catelyn Joy Morco, Gerikah Alday, Alexa Babiera, and Charles David Bernido</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gcs-primary">Institution:</p>
                            <p className="text-gray-700 dark:text-gray-300">Polytechnic University of the Philippines – Sta. Mesa</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gcs-primary">Program:</p>
                            <p className="text-gray-700 dark:text-gray-300">Bachelor of Science in Computer Engineering</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gcs-primary">Adviser:</p>
                            <p className="text-gray-700 dark:text-gray-300">Engr. [Adviser Name]</p>
                        </div>
                    </div>
                </div>

                {/* Technical Stack */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm font-bold text-gcs-text-dark dark:text-white mb-2 flex items-center gap-2">
                        <span className="text-lg">🔧</span>
                        Technical Stack
                    </h2>
                    <div className="space-y-1.5 text-[11px]">
                        <div>
                            <p className="font-semibold text-gcs-primary">Frontend:</p>
                            <p className="text-gray-700 dark:text-gray-300">React, TypeScript, Tailwind CSS, Leaflet</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gcs-primary">AI Model:</p>
                            <p className="text-gray-700 dark:text-gray-300">YOLOv8</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gcs-primary">Backend:</p>
                            <p className="text-gray-700 dark:text-gray-300">Node.js, Fastify, PostgreSQL, SerialPort</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gcs-primary">Build Tool:</p>
                            <p className="text-gray-700 dark:text-gray-300">Vite</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Acknowledgments */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <h2 className="text-sm font-bold text-gcs-text-dark dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-lg">🙏</span>
                    Acknowledgments
                </h2>
                <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    We would like to express our gratitude to our mentors, the Polytechnic University of the Philippines, and all collaborating organizations including local government units (LGUs), CAAP, and FPA for their support in making this project possible.
                </p>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 dark:bg-gray-900/50 p-3 rounded-xl text-center">
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">© 2025 Smart Mosquito Control Drone Project</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Contact: smartdroneproject@gmail.com</p>
                <div className="flex justify-center gap-4 mt-2">
                    <div className="text-[11px] text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Version:</span> 1.0.0
                    </div>
                    <div className="text-[11px] text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Release:</span> October 2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPanel;

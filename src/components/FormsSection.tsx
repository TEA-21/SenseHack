import React, { useState, useEffect } from 'react';
import { Terminal, Home, Cpu, Copy, Check, ExternalLink, Trash2, AlertTriangle, Sparkles, X } from 'lucide-react';
import { HACKATHON_CONFIG, buildGoogleFormUrl } from '../data/hackathonData';

interface HardwareFormState {
  teamName: string;
  leadEmail: string;
  leadPhone: string;
  trackId: string;
  primaryMcu: string;
  sensorsRequired: string;
  labEquipment: string[];
  additionalNotes: string;
}

interface AccommodationFormState {
  teamName: string;
  collegeName: string;
  leadEmail: string;
  leadPhone: string;
  maleCount: number;
  femaleCount: number;
  arrivalDate: string;
  departureDate: string;
  travelMode: string;
  specialRequests: string;
}

const DEFAULT_HARDWARE_STATE: HardwareFormState = {
  teamName: '',
  leadEmail: '',
  leadPhone: '',
  trackId: 'iot-edge',
  primaryMcu: 'ESP32 DevKit V1',
  sensorsRequired: '',
  labEquipment: [],
  additionalNotes: '',
};

const DEFAULT_ACCOMMODATION_STATE: AccommodationFormState = {
  teamName: '',
  collegeName: '',
  leadEmail: '',
  leadPhone: '',
  maleCount: 2,
  femaleCount: 0,
  arrivalDate: '2026-12-04',
  departureDate: '2026-12-07',
  travelMode: 'Train',
  specialRequests: '',
};

const STORAGE_KEYS = {
  hardware: 'sensehack_hardware_form_v1',
  accommodation: 'sensehack_accommodation_form_v1',
};

export const FormsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hardware' | 'accommodation'>('hardware');

  // Form states with LocalStorage restoration
  const [hardwareForm, setHardwareForm] = useState<HardwareFormState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.hardware);
      return saved ? JSON.parse(saved) : DEFAULT_HARDWARE_STATE;
    } catch {
      return DEFAULT_HARDWARE_STATE;
    }
  });

  const [accommodationForm, setAccommodationForm] = useState<AccommodationFormState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.accommodation);
      return saved ? JSON.parse(saved) : DEFAULT_ACCOMMODATION_STATE;
    } catch {
      return DEFAULT_ACCOMMODATION_STATE;
    }
  });

  // Autosave to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.hardware, JSON.stringify(hardwareForm));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [hardwareForm]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.accommodation, JSON.stringify(accommodationForm));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [accommodationForm]);

  // Modal & Handshake state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPayload, setModalPayload] = useState('');
  const [modalUrl, setModalUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Computed total members
  const totalMembers = Number(accommodationForm.maleCount) + Number(accommodationForm.femaleCount);

  // Validate Accommodation Dates
  const isDateRangeValid = () => {
    if (!accommodationForm.arrivalDate || !accommodationForm.departureDate) {
      return true;
    }
    const arrival = new Date(accommodationForm.arrivalDate).getTime();
    const departure = new Date(accommodationForm.departureDate).getTime();
    return departure >= arrival;
  };

  const handleClearDraft = () => {
    if (activeTab === 'hardware') {
      localStorage.removeItem(STORAGE_KEYS.hardware);
      setHardwareForm(DEFAULT_HARDWARE_STATE);
    } else {
      localStorage.removeItem(STORAGE_KEYS.accommodation);
      setAccommodationForm(DEFAULT_ACCOMMODATION_STATE);
    }
    setValidationError(null);
  };

  const handleToggleLabEquipment = (item: string) => {
    setHardwareForm((prev) => {
      const exists = prev.labEquipment.includes(item);
      return {
        ...prev,
        labEquipment: exists
          ? prev.labEquipment.filter((x) => x !== item)
          : [...prev.labEquipment, item],
      };
    });
  };

  const handleHardwareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!hardwareForm.teamName.trim() || !hardwareForm.leadEmail.trim()) {
      setValidationError('Please enter your Team Name and Team Lead Email.');
      return;
    }

    const payload = `=== SENSE HACK '26 // HARDWARE REQUISITION DESK ===
Timestamp: ${new Date().toISOString()}
Team Name: ${hardwareForm.teamName}
Lead Contact: ${hardwareForm.leadEmail} / ${hardwareForm.leadPhone}
Track: ${hardwareForm.trackId}
Primary MCU: ${hardwareForm.primaryMcu}
Requested Sensors: ${hardwareForm.sensorsRequired || 'None specified'}
Lab Equipment Required: ${hardwareForm.labEquipment.join(', ') || 'Standard bench only'}
Additional Notes: ${hardwareForm.additionalNotes || 'N/A'}
===================================================`;

    const guardedUrl = buildGoogleFormUrl(HACKATHON_CONFIG.registrationLinks.hardwareRequisitionForm, {
      'entry.1000001': hardwareForm.teamName,
      'entry.1000002': hardwareForm.leadEmail,
      'entry.1000003': hardwareForm.primaryMcu,
      'entry.1000004': hardwareForm.sensorsRequired,
    });

    setModalPayload(payload);
    setModalUrl(guardedUrl);
    setModalOpen(true);

    // Try clipboard write with fallback
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payload).then(
          () => setCopySuccess(true),
          () => setCopySuccess(false)
        );
      }
    } catch {
      setCopySuccess(false);
    }
  };

  const handleAccommodationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!accommodationForm.teamName.trim() || !accommodationForm.collegeName.trim()) {
      setValidationError('Please enter your Team Name and College Name.');
      return;
    }

    if (!isDateRangeValid()) {
      setValidationError('Departure date cannot be earlier than arrival date.');
      return;
    }

    if (totalMembers < 2 || totalMembers > 4) {
      setValidationError(`Total team members must be between 2 and 4. Currently: ${totalMembers}`);
      return;
    }

    const payload = `=== SENSE HACK '26 // EXTERNAL ACCOMMODATION REQUEST ===
Timestamp: ${new Date().toISOString()}
Team Name: ${accommodationForm.teamName}
College: ${accommodationForm.collegeName}
Lead Contact: ${accommodationForm.leadEmail} / ${accommodationForm.leadPhone}
Male Members: ${accommodationForm.maleCount}
Female Members: ${accommodationForm.femaleCount}
Total Room Allocation: ${totalMembers} Beds
Arrival: ${accommodationForm.arrivalDate}
Departure: ${accommodationForm.departureDate}
Travel Mode: ${accommodationForm.travelMode}
Special Requests: ${accommodationForm.specialRequests || 'Standard hostel allocation'}
=======================================================`;

    const guardedUrl = buildGoogleFormUrl(HACKATHON_CONFIG.registrationLinks.accommodationForm, {
      'entry.2000001': accommodationForm.teamName,
      'entry.2000002': accommodationForm.collegeName,
      'entry.2000003': String(totalMembers),
    });

    setModalPayload(payload);
    setModalUrl(guardedUrl);
    setModalOpen(true);

    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payload).then(
          () => setCopySuccess(true),
          () => setCopySuccess(false)
        );
      }
    } catch {
      setCopySuccess(false);
    }
  };

  const handleManualCopy = () => {
    try {
      navigator.clipboard.writeText(modalPayload);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.warn('Manual copy failed', err);
    }
  };

  const equipmentOptions = [
    'Digital Storage Oscilloscope (DSO)',
    'Dual DC Regulated Power Supply',
    'ESD Soldering & De-soldering Rig',
    'USB Logic Analyzer (24MHz 8-Ch)',
    'Spectrum Analyzer / SDR Station',
    'Arbitrary Function Generator',
  ];

  return (
    <section id="forms" className="py-20 bg-crt-bg border-b border-crt-border relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crt-amber/10 border border-crt-amber/30 text-crt-amber font-mono text-xs uppercase tracking-wider mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>On-Site Logistics &amp; Workbench Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Actionable <span className="text-crt-amber">Requisition Desk</span>
          </h2>
          <p className="mt-4 text-crt-muted text-sm sm:text-base leading-relaxed">
            Reserve hardware components from SENSE Laboratories or request on-campus hostel accommodation for external teams. 
            All form progress is auto-saved locally in your browser.
          </p>
        </div>

        {/* Tab Switcher & Clear Draft */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex p-1 rounded-xl bg-crt-card border border-crt-border">
            <button
              type="button"
              onClick={() => { setActiveTab('hardware'); setValidationError(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'hardware'
                  ? 'bg-crt-amber text-black shadow-glow-amber'
                  : 'text-crt-muted hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Hardware Requisition</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('accommodation'); setValidationError(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'accommodation'
                  ? 'bg-crt-amber-text text-black shadow-glow-amber'
                  : 'text-crt-muted hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Hostel Accommodation</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearDraft}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-crt-muted hover:text-red-400 border border-crt-border hover:border-red-400/40 text-xs font-mono transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Draft</span>
          </button>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 flex items-center gap-3 text-red-400 text-xs font-mono">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Container Card */}
        <div className="rounded-2xl bg-crt-card border border-crt-border p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          
          {/* TAB 1: HARDWARE REQUISITION FORM */}
          {activeTab === 'hardware' && (
            <form onSubmit={handleHardwareSubmit} className="space-y-6">
              <div className="border-b border-crt-border/60 pb-4 mb-6">
                <h3 className="font-display font-bold text-xl text-white">
                  SENSE Hardware Lab Components &amp; Instrumentation
                </h3>
                <p className="text-crt-muted text-xs mt-1">
                  Components will be calibrated and staged at your assigned bench in Anna Auditorium.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={hardwareForm.teamName}
                    onChange={(e) => setHardwareForm({ ...hardwareForm, teamName: e.target.value })}
                    placeholder="e.g. PulseNodes"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Lead Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={hardwareForm.leadEmail}
                    onChange={(e) => setHardwareForm({ ...hardwareForm, leadEmail: e.target.value })}
                    placeholder="teamlead@vitstudent.ac.in"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Primary Microcontroller / Dev Board
                  </label>
                  <select
                    value={hardwareForm.primaryMcu}
                    onChange={(e) => setHardwareForm({ ...hardwareForm, primaryMcu: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  >
                    <option value="ESP32 DevKit V1 (Wi-Fi/BLE)">ESP32 DevKit V1 (Wi-Fi/BLE)</option>
                    <option value="Arduino Uno R3 / R4">Arduino Uno R3 / R4</option>
                    <option value="Raspberry Pi Pico W (RP2040)">Raspberry Pi Pico W (RP2040)</option>
                    <option value="STM32 Nucleo-F401RE (ARM Cortex-M4)">STM32 Nucleo-F401RE (ARM Cortex-M4)</option>
                    <option value="Xilinx Spartan-7 / Basys 3 FPGA">Xilinx Spartan-7 / Basys 3 FPGA</option>
                    <option value="Texas Instruments MSP430 / C2000">Texas Instruments MSP430 / C2000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Lead WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    value={hardwareForm.leadPhone}
                    onChange={(e) => setHardwareForm({ ...hardwareForm, leadPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                  Specific Sensors / Modules Needed
                </label>
                <input
                  type="text"
                  value={hardwareForm.sensorsRequired}
                  onChange={(e) => setHardwareForm({ ...hardwareForm, sensorsRequired: e.target.value })}
                  placeholder="e.g. MPU6050 Gyro, LoRa SX1278, MAX30102 Pulse, VL53L0X ToF Lidar..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                />
              </div>

              {/* Lab Bench Equipment Multi-select */}
              <div>
                <label className="block text-xs font-mono text-crt-muted mb-2 uppercase">
                  Required Laboratory Instrumentation (Multi-select)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {equipmentOptions.map((item) => {
                    const checked = hardwareForm.labEquipment.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => handleToggleLabEquipment(item)}
                        className={`p-3 rounded-lg border text-left text-xs font-mono flex items-center justify-between transition-all ${
                          checked
                            ? 'bg-crt-amber/15 border-crt-amber text-white'
                            : 'bg-crt-surface border-crt-border text-crt-muted hover:text-white'
                        }`}
                      >
                        <span className="line-clamp-1">{item}</span>
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                          checked ? 'bg-crt-amber text-black font-bold' : 'border border-crt-border'
                        }`}>
                          {checked ? '✓' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                  Additional Notes / Specific Part Numbers
                </label>
                <textarea
                  rows={2}
                  value={hardwareForm.additionalNotes}
                  onChange={(e) => setHardwareForm({ ...hardwareForm, additionalNotes: e.target.value })}
                  placeholder="Mention voltage limits, pin header requirements, or special breadboards..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-crt-border/60 flex items-center justify-between">
                <span className="font-mono text-[11px] text-crt-muted">
                  Auto-saved in browser storage
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs uppercase font-bold tracking-wider bg-crt-amber text-black hover:bg-amber-400 transition-all shadow-glow-amber"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Requisition Handshake</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ACCOMMODATION REQUEST FORM */}
          {activeTab === 'accommodation' && (
            <form onSubmit={handleAccommodationSubmit} className="space-y-6">
              <div className="border-b border-crt-border/60 pb-4 mb-6">
                <h3 className="font-display font-bold text-xl text-white">
                  External Delegate Hostel Accommodation
                </h3>
                <p className="text-crt-muted text-xs mt-1">
                  Free stay provided for non-VIT shortlisted finalists. Men and women allocated to separate secured hostel blocks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={accommodationForm.teamName}
                    onChange={(e) => setAccommodationForm({ ...accommodationForm, teamName: e.target.value })}
                    placeholder="e.g. Team BioSync"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Represented College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={accommodationForm.collegeName}
                    onChange={(e) => setAccommodationForm({ ...accommodationForm, collegeName: e.target.value })}
                    placeholder="e.g. IIT Madras"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Lead Delegate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={accommodationForm.leadEmail}
                    onChange={(e) => setAccommodationForm({ ...accommodationForm, leadEmail: e.target.value })}
                    placeholder="delegate@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Emergency Phone Number
                  </label>
                  <input
                    type="tel"
                    value={accommodationForm.leadPhone}
                    onChange={(e) => setAccommodationForm({ ...accommodationForm, leadPhone: e.target.value })}
                    placeholder="+91 99887 76655"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Gender Count & Auto-computed Total */}
              <div className="p-4 rounded-xl bg-crt-surface border border-crt-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase font-semibold text-crt-phosphor">
                    Team Member Headcount &amp; Hostel Wing Allocation
                  </span>
                  <span className="font-mono text-xs text-crt-amber font-bold px-2 py-0.5 rounded bg-crt-amber/10 border border-crt-amber/30">
                    Total: {totalMembers} Members
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-crt-muted mb-1">
                      Male Members (Men&apos;s Hostel)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={accommodationForm.maleCount}
                      onChange={(e) => setAccommodationForm({ ...accommodationForm, maleCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-crt-muted mb-1">
                      Female Members (Ladies Hostel)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={accommodationForm.femaleCount}
                      onChange={(e) => setAccommodationForm({ ...accommodationForm, femaleCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {(totalMembers < 2 || totalMembers > 4) && (
                  <p className="text-amber-400 font-mono text-xs">
                    &bull; Note: Official hackathon team size must be between 2 and 4 members.
                  </p>
                )}
              </div>

              {/* Arrival and Departure Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Expected Arrival Date
                  </label>
                  <input
                    type="date"
                    value={accommodationForm.arrivalDate}
                    onChange={(e) => setAccommodationForm({ ...accommodationForm, arrivalDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                    Expected Departure Date
                  </label>
                  <input
                    type="date"
                    value={accommodationForm.departureDate}
                    onChange={(e) => setAccommodationForm({ ...accommodationForm, departureDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                  Travel Mode to Katpadi / Vellore
                </label>
                <select
                  value={accommodationForm.travelMode}
                  onChange={(e) => setAccommodationForm({ ...accommodationForm, travelMode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                >
                  <option value="Train (Katpadi Junction - KPD)">Train (Katpadi Junction - KPD)</option>
                  <option value="Flight (Chennai / Bangalore + Cab)">Flight (Chennai / Bangalore + Cab)</option>
                  <option value="Intercity Bus (Vellore New Bus Stand)">Intercity Bus (Vellore New Bus Stand)</option>
                  <option value="Personal Vehicle">Personal Vehicle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-crt-muted mb-1.5 uppercase">
                  Special Accessibility / Food Requirements
                </label>
                <input
                  type="text"
                  value={accommodationForm.specialRequests}
                  onChange={(e) => setAccommodationForm({ ...accommodationForm, specialRequests: e.target.value })}
                  placeholder="e.g. Jain food option, wheelchair accessibility..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-crt-surface border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-crt-border/60 flex items-center justify-between">
                <span className="font-mono text-[11px] text-crt-muted">
                  Auto-saved in browser storage
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs uppercase font-bold tracking-wider bg-crt-amber text-black hover:bg-amber-400 transition-all shadow-glow-amber"
                >
                  <Home className="w-4 h-4" />
                  <span>Submit Accommodation Request</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* SUBMISSION MODAL WITH TEXTAREA FALLBACK */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-crt-card border border-crt-border max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-lg text-crt-muted hover:text-white hover:bg-crt-surface"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3 text-xs font-mono text-crt-amber uppercase font-bold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Requisition Payload Generated</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white mb-2">
                Handshake Ready
              </h3>

              <p className="text-crt-muted text-xs sm:text-sm mb-4 leading-relaxed">
                {copySuccess
                  ? 'Your formatted payload has been automatically copied to your clipboard!'
                  : 'Review your formatted payload below. Copy it to submit in the official Google Form.'}
              </p>

              {/* Visual Fallback Textarea */}
              <div className="relative mb-4">
                <textarea
                  readOnly
                  rows={7}
                  value={modalPayload}
                  className="w-full p-3.5 rounded-lg bg-crt-surface border border-crt-border text-crt-phosphor text-xs font-mono resize-none focus:outline-none selection:bg-crt-amber selection:text-black"
                />
                <button
                  type="button"
                  onClick={handleManualCopy}
                  className="absolute top-3 right-3 p-1.5 rounded bg-crt-card border border-crt-border text-crt-muted hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={modalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-mono text-xs uppercase font-bold bg-crt-amber text-black hover:bg-amber-400 transition-all shadow-glow-amber"
                >
                  <span>Open Official Google Form &amp; Paste</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-mono text-xs uppercase font-semibold text-crt-muted hover:text-white border border-crt-border transition-colors"
                >
                  Dismiss
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

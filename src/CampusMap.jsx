import React from 'react';

const IDS = ['main', 'cs', 'lib', 'aud', 'workshop', 'health', 'bus', 'atm', 'canteen', 'ground', 'hostel', 'parking'];

export default function CampusMap({ mapScale, routeD, selectedBuildingId, onBuildingClick }) {
  const op = (id) => (!selectedBuildingId ? 1 : selectedBuildingId === id ? 1 : 0.45);
  const sw = (id) => (!selectedBuildingId ? '1.5' : selectedBuildingId === id ? '3' : '1.5');

  return (
    <svg
      id="campusMapSvg"
      viewBox="0 0 880 450"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `scale(${mapScale})`,
        transformOrigin: 'center',
        transition: 'transform 0.15s ease',
      }}
    >
      <rect width="880" height="450" fill="#1C2E1C" />
      <rect x="0" y="195" width="880" height="30" fill="#2A3A2A" />
      <rect x="200" y="0" width="30" height="450" fill="#2A3A2A" />
      <rect x="600" y="0" width="30" height="450" fill="#2A3A2A" />
      <rect x="0" y="375" width="880" height="22" fill="#2A3A2A" />
      <g fill="none" stroke="#4A604A" strokeWidth="3" strokeDasharray="7,5" strokeLinecap="round" opacity="0.85">
        <path d="M 35 125 H 845" />
        <path d="M 215 125 V 210" />
        <path d="M 615 125 V 420" />
        <path d="M 230 315 H 600" />
        <path d="M 400 225 V 360" />
      </g>
      <g fill="none" stroke="#3D5244" strokeWidth="2" strokeDasharray="4,6" opacity="0.7">
        <path d="M 48 388 H 820" />
        <path d="M 320 225 H 520" />
      </g>
      <rect x="230" y="0" width="370" height="195" fill="#1E3A1E" rx="0" />
      <rect x="230" y="225" width="370" height="225" fill="#1E3A1E" rx="0" />
      <rect x="0" y="0" width="200" height="195" fill="#182E18" />
      <rect x="0" y="225" width="200" height="225" fill="#182E18" />
      <rect x="630" y="0" width="250" height="195" fill="#182E18" />
      <rect x="630" y="225" width="250" height="225" fill="#182E18" />
      <g fill="#2D5A2D">
        <circle cx="260" cy="50" r="18" />
        <circle cx="310" cy="80" r="14" />
        <circle cx="560" cy="50" r="18" />
        <circle cx="510" cy="80" r="14" />
        <circle cx="260" cy="370" r="16" />
        <circle cx="310" cy="340" r="12" />
        <circle cx="560" cy="370" r="16" />
        <circle cx="510" cy="340" r="12" />
        <circle cx="50" cy="100" r="14" />
        <circle cx="120" cy="60" r="16" />
        <circle cx="150" cy="300" r="14" />
        <circle cx="70" cy="330" r="12" />
        <circle cx="680" cy="100" r="14" />
        <circle cx="750" cy="60" r="16" />
        <circle cx="800" cy="300" r="14" />
        <circle cx="700" cy="340" r="12" />
      </g>
      <g id="mapRefNetwork" pointerEvents="none" opacity="0.95">
        <line x1="38" y1="210" x2="852" y2="210" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="210" x2="100" y2="88" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeDasharray="5,4" strokeLinecap="round" />
        <line x1="275" y1="210" x2="275" y2="100" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeDasharray="5,4" strokeLinecap="round" />
        <line x1="440" y1="210" x2="440" y2="88" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeDasharray="5,4" strokeLinecap="round" />
        <line x1="591" y1="210" x2="591" y2="100" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeDasharray="5,4" strokeLinecap="round" />
        <line x1="750" y1="210" x2="750" y2="88" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeDasharray="5,4" strokeLinecap="round" />
        <line x1="215" y1="210" x2="215" y2="125" stroke="rgba(255,255,255,0.42)" strokeWidth="2" strokeDasharray="4,5" strokeLinecap="round" />
        <line x1="615" y1="210" x2="615" y2="125" stroke="rgba(255,255,255,0.42)" strokeWidth="2" strokeDasharray="4,5" strokeLinecap="round" />
        <path d="M 100 210 V 300" stroke="rgba(255,255,255,0.34)" strokeWidth="2" strokeDasharray="5,5" fill="none" strokeLinecap="round" />
        <path d="M 420 210 V 310" stroke="rgba(255,255,255,0.34)" strokeWidth="2" strokeDasharray="5,5" fill="none" strokeLinecap="round" />
        <path d="M 750 210 V 305" stroke="rgba(255,255,255,0.34)" strokeWidth="2" strokeDasharray="5,5" fill="none" strokeLinecap="round" />
        <path d="M 440 210 V 411" stroke="rgba(255,255,255,0.34)" strokeWidth="2" strokeDasharray="5,5" fill="none" strokeLinecap="round" />
        <path d="M 260 210 V 237" stroke="rgba(255,255,255,0.42)" strokeWidth="2" strokeDasharray="4,4" fill="none" strokeLinecap="round" />
        <path d="M 643 210 V 213" stroke="rgba(255,255,255,0.42)" strokeWidth="2" strokeDasharray="4,4" fill="none" strokeLinecap="round" />
        <path d="M 38 178 H 185" stroke="rgba(255,255,255,0.36)" strokeWidth="1.8" strokeDasharray="4,4" fill="none" strokeLinecap="round" />
        <path d="M 125 125 H 800" stroke="rgba(180,220,180,0.45)" strokeWidth="1.8" strokeDasharray="6,5" fill="none" strokeLinecap="round" />
        <path d="M 320 125 L 320 210" stroke="rgba(180,220,180,0.38)" strokeWidth="1.8" strokeDasharray="6,5" fill="none" strokeLinecap="round" />
        <path d="M 500 125 L 500 210" stroke="rgba(180,220,180,0.38)" strokeWidth="1.8" strokeDasharray="6,5" fill="none" strokeLinecap="round" />
        <path d="M 700 125 L 700 210" stroke="rgba(180,220,180,0.38)" strokeWidth="1.8" strokeDasharray="6,5" fill="none" strokeLinecap="round" />
        <path d="M 215 388 H 665" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeDasharray="5,6" fill="none" strokeLinecap="round" />
        <path d="M 440 388 V 411" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeDasharray="5,6" fill="none" strokeLinecap="round" />
        <text x="518" y="204" fill="rgba(255,255,255,0.55)" fontSize="7.5" fontFamily="Manrope" fontWeight="700" textAnchor="middle">
          MAIN SPINE — straight line from gate
        </text>
      </g>
      <rect id="bld-main" x="20" y="20" width="160" height="155" rx="6" fill="#3A5A8C" stroke="#5A7FAC" strokeWidth={sw('main')} className="map-building" opacity={op('main')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('main')} />
      <text x="100" y="90" textAnchor="middle" fill="white" fontSize="11" fontFamily="Manrope" fontWeight="700" pointerEvents="none">MAIN BLOCK</text>
      <text x="100" y="108" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="Manrope" pointerEvents="none">Admin & Principal</text>
      <rect id="bld-cs" x="330" y="20" width="220" height="155" rx="6" fill="#1A5C4A" stroke="#2A8C6C" strokeWidth={sw('cs')} className="map-building" opacity={op('cs')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('cs')} />
      <text x="440" y="90" textAnchor="middle" fill="white" fontSize="11" fontFamily="Manrope" fontWeight="700" pointerEvents="none">CS DEPARTMENT</text>
      <text x="440" y="108" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="Manrope" pointerEvents="none">Rooms 201–210, Labs</text>
      <rect id="bld-lib" x="640" y="20" width="220" height="155" rx="6" fill="#6B3A8C" stroke="#9B5ABC" strokeWidth={sw('lib')} className="map-building" opacity={op('lib')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('lib')} />
      <rect id="bld-aud" x="232" y="38" width="86" height="125" rx="6" fill="#4A6B9C" stroke="#6B8FCC" strokeWidth={sw('aud')} className="map-building" opacity={op('aud')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('aud')} />
      <text x="275" y="98" textAnchor="middle" fill="white" fontSize="10" fontFamily="Manrope" fontWeight="700" pointerEvents="none">AUDITORIUM</text>
      <text x="275" y="114" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="Manrope" pointerEvents="none">800 seats</text>
      <rect id="bld-workshop" x="552" y="38" width="78" height="125" rx="6" fill="#2A5A6A" stroke="#3A7A8C" strokeWidth={sw('workshop')} className="map-building" opacity={op('workshop')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('workshop')} />
      <text x="591" y="95" textAnchor="middle" fill="white" fontSize="9" fontFamily="Manrope" fontWeight="700" pointerEvents="none">WORKSHOP</text>
      <text x="591" y="110" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="Manrope" pointerEvents="none">ME · Fab Lab</text>
      <text x="750" y="90" textAnchor="middle" fill="white" fontSize="11" fontFamily="Manrope" fontWeight="700" pointerEvents="none">LIBRARY</text>
      <text x="750" y="108" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="Manrope" pointerEvents="none">Central Library & Reading</text>
      <rect id="bld-health" x="38" y="178" width="124" height="32" rx="5" fill="#2A6B5A" stroke="#3A9B7A" strokeWidth={sw('health')} className="map-building" opacity={op('health')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('health')} />
      <text x="100" y="198" textAnchor="middle" fill="white" fontSize="9" fontFamily="Manrope" fontWeight="700" pointerEvents="none">HEALTH CENTER</text>
      <rect id="bld-bus" x="238" y="218" width="44" height="38" rx="5" fill="#4A4A5E" stroke="#6A6A82" strokeWidth={sw('bus')} className="map-building" opacity={op('bus')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('bus')} />
      <text x="260" y="242" textAnchor="middle" fill="white" fontSize="8" fontFamily="Manrope" fontWeight="700" pointerEvents="none">BUS</text>
      <rect id="bld-atm" x="626" y="198" width="34" height="30" rx="4" fill="#3D4A5E" stroke="#5A6A82" strokeWidth={sw('atm')} className="map-building" opacity={op('atm')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('atm')} />
      <text x="643" y="217" textAnchor="middle" fill="white" fontSize="7" fontFamily="Manrope" fontWeight="700" pointerEvents="none">ATM</text>
      <rect id="bld-canteen" x="20" y="240" width="160" height="120" rx="6" fill="#8C5A1A" stroke="#BC8A2A" strokeWidth={sw('canteen')} className="map-building" opacity={op('canteen')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('canteen')} />
      <text x="100" y="300" textAnchor="middle" fill="white" fontSize="11" fontFamily="Manrope" fontWeight="700" pointerEvents="none">CANTEEN</text>
      <text x="100" y="316" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="Manrope" pointerEvents="none">Cafeteria & Food Court</text>
      <rect id="bld-ground" x="280" y="250" width="280" height="120" rx="6" fill="#1A4A1A" stroke="#2A7A2A" strokeWidth={sw('ground')} className="map-building" opacity={op('ground')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('ground')} />
      <ellipse cx="420" cy="315" rx="90" ry="50" fill="none" stroke="#2A7A2A" strokeWidth="2" strokeDasharray="6,3" />
      <text x="420" y="305" textAnchor="middle" fill="white" fontSize="11" fontFamily="Manrope" fontWeight="700" pointerEvents="none">SPORTS GROUND</text>
      <text x="420" y="322" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="Manrope" pointerEvents="none">Cricket · Football · Basketball</text>
      <rect id="bld-hostel" x="640" y="240" width="220" height="130" rx="6" fill="#8C2A2A" stroke="#BC4A4A" strokeWidth={sw('hostel')} className="map-building" opacity={op('hostel')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('hostel')} />
      <rect id="bld-parking" x="300" y="382" width="280" height="58" rx="6" fill="#3A3A4A" stroke="#5A5A6A" strokeWidth={sw('parking')} className="map-building" opacity={op('parking')} style={{ cursor: 'pointer' }} onClick={() => onBuildingClick('parking')} />
      <text x="440" y="408" textAnchor="middle" fill="white" fontSize="10" fontFamily="Manrope" fontWeight="700" pointerEvents="none">PARKING</text>
      <text x="440" y="424" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="8" fontFamily="Manrope" pointerEvents="none">P1 · P2 · EV bays</text>
      <text x="750" y="310" textAnchor="middle" fill="white" fontSize="11" fontFamily="Manrope" fontWeight="700" pointerEvents="none">HOSTEL</text>
      <text x="750" y="328" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="Manrope" pointerEvents="none">Boys & Girls Blocks</text>
      <circle cx="440" cy="210" r="8" fill="#FFD700" stroke="white" strokeWidth="2">
        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="440" y="196" textAnchor="middle" fill="#FFD700" fontSize="9" fontFamily="Manrope" fontWeight="700">You are here</text>
      <rect x="200" y="188" width="30" height="44" fill="#555" rx="2" />
      <text x="215" y="215" textAnchor="middle" fill="white" fontSize="8" fontFamily="Manrope" fontWeight="700">GATE</text>
      <g id="mapRouteGroup" pointerEvents="none" style={{ display: routeD ? 'block' : 'none' }}>
        <path d={routeD || ''} fill="none" stroke="#F2B93B" strokeWidth="14" strokeOpacity="0.22" strokeLinecap="round" strokeLinejoin="round" />
        <path d={routeD || ''} fill="none" stroke="#FFD54A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 8">
          <animate attributeName="strokeDashoffset" from="0" to="40" dur="1.2s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}

import { useState } from 'react'

const TRAVEL_MODES = [
  {
    id: 'fly',
    icon: '✈',
    label: 'Fly',
    subtitle: 'Air New Zealand / Jetstar',
    color: '#0EA5E9',
    accentLight: '#E0F5FF',
    cost: { low: 59, high: 350, typical: 130, note: 'Economy fare, booked in advance' },
    time: {
      travel: '1h 10m',
      total: '3h 30m',
      breakdown: [
        { label: 'Airport transit', value: '45 min' },
        { label: 'Check-in & security', value: '45 min' },
        { label: 'Flight', value: '1h 10m' },
        { label: 'Baggage & exit', value: '20 min' },
        { label: 'Dest. transit', value: '30 min' },
      ],
    },
    co2: { kg: 93, context: 'per passenger, economy' },
    pros: ['Fastest door-to-door on a good day', 'Multiple daily departures', 'Good for luggage'],
    cons: ['High carbon footprint', 'Airport hassle overhead', 'Delays can cascade badly', 'Baggage fees can inflate costs'],
    bestFor: 'Tight schedules where time is money.',
  },
  {
    id: 'train',
    icon: '🚄',
    label: 'Train',
    subtitle: 'KiwiRail Interislander (+ ferry)',
    color: '#10B981',
    accentLight: '#ECFDF5',
    cost: { low: 99, high: 219, typical: 139, note: 'Scenic train + Interislander ferry combo' },
    time: {
      travel: '11h 30m',
      total: '12h 30m',
      breakdown: [
        { label: 'Auckland → Picton (Overlander/Northern Explorer)', value: '~10h' },
        { label: 'Ferry check-in & sailing', value: '~3h 30m' },
        { label: 'Picton → Wellington rail/bus', value: '~1h (bus link)' },
      ],
    },
    co2: { kg: 7, context: 'rail + ferry combined, per passenger' },
    pros: ['Spectacularly scenic route', 'Very low emissions', 'No airport stress', 'Walk around freely'],
    cons: ['Very long journey — better as an experience than transport', 'Limited departure days (Northern Explorer runs 3x/week)', 'Requires overnight or very early start'],
    bestFor: 'Travellers who want the journey to be part of the trip.',
  },
  {
    id: 'bus',
    icon: '🚌',
    label: 'Bus',
    subtitle: 'InterCity + Interislander ferry',
    color: '#F59E0B',
    accentLight: '#FFFBEB',
    cost: { low: 55, high: 130, typical: 85, note: 'Including ferry, booked ahead' },
    time: {
      travel: '12h',
      total: '12h 30m',
      breakdown: [
        { label: 'Auckland → Picton (bus)', value: '~8h 30m' },
        { label: 'Interislander ferry', value: '~3h 30m' },
        { label: 'Transfer in Wellington', value: '~30 min' },
      ],
    },
    co2: { kg: 14, context: 'coach + ferry, per passenger' },
    pros: ['Most affordable option', 'Low carbon vs flying', 'No car required', 'Relaxed pace'],
    cons: ['Very long travel day', 'Limited comfort vs train', 'Ferry conditions affect experience'],
    bestFor: 'Budget travellers and backpackers with time to spare.',
  },
  {
    id: 'drive',
    icon: '🚗',
    label: 'Drive',
    subtitle: 'Via Interislander ferry',
    color: '#8B5CF6',
    accentLight: '#F5F3FF',
    cost: { low: 180, high: 350, typical: 240, note: 'Fuel + ferry vehicle fare (solo, petrol car)' },
    time: {
      travel: '9h',
      total: '9h 30m',
      breakdown: [
        { label: 'Auckland → Picton (drive)', value: '~5h' },
        { label: 'Ferry check-in & sailing', value: '~3h 30m' },
        { label: 'Picton → Wellington (drive)', value: '~1h' },
      ],
    },
    co2: { kg: 85, context: 'per car (solo driver, average petrol vehicle)' },
    pros: ['Ultimate flexibility', 'Share costs with passengers', 'Great road trip scenery', 'Door-to-door convenience'],
    cons: ['High cost for solo travel', 'Long drive requires breaks', 'Ferry must be booked in advance', 'Fatiguing'],
    bestFor: 'Groups or families — cost & carbon per person drops significantly.',
  },
  {
    id: 'ev',
    icon: '⚡',
    label: 'Drive (EV)',
    subtitle: 'Electric vehicle + ferry',
    color: '#06B6D4',
    accentLight: '#ECFEFF',
    cost: { low: 140, high: 280, typical: 185, note: 'Charging (~$15) + ferry vehicle fare' },
    time: {
      travel: '9h 30m',
      total: '10h',
      breakdown: [
        { label: 'Auckland → Picton (EV)', value: '~5h 30m' },
        { label: 'Charging stops (est.)', value: '~30–60 min' },
        { label: 'Ferry sailing', value: '~3h 30m' },
        { label: 'Picton → Wellington', value: '~1h' },
      ],
    },
    co2: { kg: 22, context: 'NZ grid + ferry, per vehicle (solo)' },
    pros: ['Much lower emissions than petrol', 'Cheaper fuel cost', 'Improves with passengers', 'Scenic route'],
    cons: ['Charging infrastructure still developing on route', 'Slightly longer travel time', 'Upfront vehicle cost'],
    bestFor: 'Eco-conscious road-trippers who already own an EV.',
  },
]

const RECOMMENDATIONS = [
  {
    scenario: 'You value your time above all else',
    mode: 'fly',
    icon: '⏱',
    detail: 'Flying is the only realistic option for a same-day business trip. Book Air New Zealand flexible fares and use carry-on only to shave 40+ minutes off the airport experience.',
  },
  {
    scenario: 'You\'re on a tight budget',
    mode: 'bus',
    icon: '💰',
    detail: 'The InterCity bus + Interislander combo regularly offers fares under $70. Book several weeks in advance and travel mid-week for the best deals.',
  },
  {
    scenario: 'Lowest environmental impact',
    mode: 'train',
    icon: '🌿',
    detail: 'Rail produces roughly 13× less CO₂ per passenger than flying. The Northern Explorer + ferry is the greenest way to travel this route — and a genuine experience.',
  },
  {
    scenario: 'Travelling as a family or group',
    mode: 'drive',
    icon: '👨‍👩‍👧',
    detail: 'With 3–4 passengers, driving splits the ferry and fuel costs to roughly $60–80 per person — competitive with flying, with full flexibility. Consider an EV if you have access to one.',
  },
  {
    scenario: 'You want the journey to be the destination',
    mode: 'train',
    icon: '🏔',
    detail: 'The Northern Explorer passes through the Central Plateau, past Tongariro, and through stunning river gorges. Pair it with a night in Palmerston North and make a weekend of it.',
  },
]

const modeMap = Object.fromEntries(TRAVEL_MODES.map(m => [m.id, m]))

function Co2Bar({ kg, max = 100 }) {
  const pct = Math.min((kg / max) * 100, 100)
  const color = kg < 20 ? '#10B981' : kg < 50 ? '#F59E0B' : '#EF4444'
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ height: 6, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 99,
            transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
          }}
        />
      </div>
    </div>
  )
}

function TravelCard({ mode, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: isSelected ? mode.color : '#fff',
        border: `2px solid ${isSelected ? mode.color : '#E5E7EB'}`,
        borderRadius: 16,
        padding: '20px 16px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.25s ease',
        transform: isSelected ? 'translateY(-3px)' : 'none',
        boxShadow: isSelected
          ? `0 12px 40px ${mode.color}40`
          : '0 2px 8px rgba(0,0,0,0.06)',
        flex: '1 1 150px',
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{mode.icon}</div>
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          fontWeight: 700,
          color: isSelected ? '#fff' : '#111',
          lineHeight: 1.2,
        }}
      >
        {mode.label}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          color: isSelected ? 'rgba(255,255,255,0.8)' : '#6B7280',
          marginTop: 2,
        }}
      >
        {mode.subtitle}
      </div>
    </button>
  )
}

function DetailPanel({ mode }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: '32px 32px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        border: '1px solid #F3F4F6',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div
          style={{
            background: mode.accentLight,
            borderRadius: 16,
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}
        >
          {mode.icon}
        </div>
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              fontWeight: 900,
              color: '#111',
              margin: 0,
            }}
          >
            {mode.label}
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: '#6B7280',
              margin: 0,
              fontSize: 14,
            }}
          >
            {mode.subtitle}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Cost */}
        <div
          style={{
            background: mode.accentLight,
            borderRadius: 14,
            padding: '20px 20px',
            borderLeft: `4px solid ${mode.color}`,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 6,
            }}
          >
            Cost
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 700,
              color: mode.color,
              lineHeight: 1,
            }}
          >
            ${mode.cost.typical}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: '#6B7280',
              marginTop: 4,
            }}
          >
            Typical · ${mode.cost.low}–${mode.cost.high} range
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: '#9CA3AF',
              marginTop: 4,
              fontStyle: 'italic',
            }}
          >
            {mode.cost.note}
          </div>
        </div>

        {/* Time */}
        <div
          style={{
            background: '#F9FAFB',
            borderRadius: 14,
            padding: '20px 20px',
            borderLeft: `4px solid #374151`,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 6,
            }}
          >
            Total Journey Time
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 700,
              color: '#111',
              lineHeight: 1,
            }}
          >
            {mode.time.total}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: '#6B7280',
              marginTop: 4,
            }}
          >
            Travel only: {mode.time.travel}
          </div>
          <div style={{ marginTop: 12 }}>
            {mode.time.breakdown.map((b, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: '#6B7280',
                  padding: '2px 0',
                  borderBottom: i < mode.time.breakdown.length - 1 ? '1px dashed #E5E7EB' : 'none',
                }}
              >
                <span>{b.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: '#374151' }}>
                  {b.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CO2 */}
        <div
          style={{
            background: '#F0FDF4',
            borderRadius: 14,
            padding: '20px 20px',
            borderLeft: `4px solid #10B981`,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 6,
            }}
          >
            CO₂ Emissions
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 700,
              color: mode.co2.kg < 30 ? '#10B981' : mode.co2.kg < 60 ? '#F59E0B' : '#EF4444',
              lineHeight: 1,
            }}
          >
            {mode.co2.kg} kg
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: '#6B7280',
              marginTop: 4,
            }}
          >
            {mode.co2.context}
          </div>
          <Co2Bar kg={mode.co2.kg} />
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: '#9CA3AF',
              marginTop: 8,
            }}
          >
            {mode.co2.kg < 30
              ? '🟢 Low impact'
              : mode.co2.kg < 60
              ? '🟡 Moderate impact'
              : '🔴 High impact'}
          </div>
        </div>
      </div>

      {/* Pros / Cons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#10B981',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            Advantages
          </div>
          {mode.pros.map((p, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: '#374151',
                padding: '4px 0',
                paddingLeft: 14,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  color: '#10B981',
                  fontWeight: 700,
                }}
              >
                +
              </span>
              {p}
            </div>
          ))}
        </div>
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#EF4444',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            Drawbacks
          </div>
          {mode.cons.map((c, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: '#374151',
                padding: '4px 0',
                paddingLeft: 14,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  color: '#EF4444',
                  fontWeight: 700,
                }}
              >
                −
              </span>
              {c}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${mode.accentLight}, #fff)`,
          border: `1px solid ${mode.color}33`,
          borderRadius: 12,
          padding: '14px 18px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: '#374151',
        }}
      >
        <span style={{ fontWeight: 600, color: mode.color }}>Best for: </span>
        {mode.bestFor}
      </div>
    </div>
  )
}

function ComparisonTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
        }}
      >
        <thead>
          <tr style={{ background: '#111' }}>
            {['Mode', 'Typical Cost', 'Total Time', 'CO₂ (kg)', 'Best For'].map(h => (
              <th
                key={h}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#fff',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TRAVEL_MODES.map((m, i) => (
            <tr
              key={m.id}
              style={{
                background: i % 2 === 0 ? '#fff' : '#F9FAFB',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <td style={{ padding: '12px 16px' }}>
                <span style={{ marginRight: 8 }}>{m.icon}</span>
                <span style={{ fontWeight: 600, color: m.color }}>{m.label}</span>
              </td>
              <td style={{ padding: '12px 16px', fontFamily: "'DM Mono', monospace" }}>
                ${m.cost.typical}
              </td>
              <td style={{ padding: '12px 16px', fontFamily: "'DM Mono', monospace" }}>
                {m.time.total}
              </td>
              <td style={{ padding: '12px 16px' }}>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color:
                      m.co2.kg < 30 ? '#10B981' : m.co2.kg < 60 ? '#F59E0B' : '#EF4444',
                    fontWeight: 600,
                  }}
                >
                  {m.co2.kg}
                </span>
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  color: '#6B7280',
                  fontSize: 12,
                  maxWidth: 200,
                }}
              >
                {m.bestFor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function App() {
  const [selected, setSelected] = useState('fly')
  const [tab, setTab] = useState('explore') // 'explore' | 'compare' | 'recommend'

  const selectedMode = modeMap[selected]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8F7F4',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      {/* Hero Header */}
      <div
        style={{
          background: '#0D1117',
          color: '#fff',
          padding: '48px 32px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #0EA5E9, #10B981, #8B5CF6)',
          }}
        />
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.15em',
              color: '#6B7280',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            New Zealand · Travel Guide
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(36px, 6vw, 60px)',
              fontWeight: 900,
              margin: '0 0 4px',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Auckland
            <span style={{ color: '#0EA5E9', margin: '0 12px' }}>→</span>
            Wellington
          </h1>
          <p
            style={{
              color: '#9CA3AF',
              margin: '12px 0 0',
              fontSize: 16,
              maxWidth: 540,
              lineHeight: 1.6,
            }}
          >
            Five ways to travel between Aotearoa's largest city and its capital — compared
            by cost, time, and environmental footprint.
          </p>
          <div
            style={{
              marginTop: 12,
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: '#4B5563',
              letterSpacing: '0.08em',
            }}
          >
            ⚠ AI-generated commentary — verify current prices & schedules before booking
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            display: 'flex',
            gap: 0,
            padding: '0 32px',
          }}
        >
          {[
            { key: 'explore', label: 'Explore Modes' },
            { key: 'compare', label: 'Compare All' },
            { key: 'recommend', label: 'Recommendations' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: tab === t.key ? '3px solid #0D1117' : '3px solid transparent',
                padding: '16px 20px',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: tab === t.key ? 600 : 400,
                color: tab === t.key ? '#111' : '#6B7280',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 32px 64px' }}>
        {/* EXPLORE TAB */}
        {tab === 'explore' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 28,
              }}
            >
              {TRAVEL_MODES.map(m => (
                <TravelCard
                  key={m.id}
                  mode={m}
                  isSelected={selected === m.id}
                  onClick={() => setSelected(m.id)}
                />
              ))}
            </div>
            <DetailPanel mode={selectedMode} />
          </div>
        )}

        {/* COMPARE TAB */}
        {tab === 'compare' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24,
                fontWeight: 700,
                color: '#111',
                marginBottom: 20,
              }}
            >
              Side-by-side comparison
            </div>
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                border: '1px solid #F3F4F6',
                marginBottom: 32,
              }}
            >
              <ComparisonTable />
            </div>

            {/* Visual CO2 bars */}
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 28,
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                border: '1px solid #F3F4F6',
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#111',
                  marginBottom: 20,
                }}
              >
                CO₂ footprint at a glance
              </div>
              {[...TRAVEL_MODES].sort((a, b) => a.co2.kg - b.co2.kg).map(m => (
                <div key={m.id} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    <span>
                      {m.icon} {m.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 600,
                        color:
                          m.co2.kg < 30 ? '#10B981' : m.co2.kg < 60 ? '#F59E0B' : '#EF4444',
                      }}
                    >
                      {m.co2.kg} kg CO₂
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      background: '#F3F4F6',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(m.co2.kg / 100) * 100}%`,
                        height: '100%',
                        background:
                          m.co2.kg < 30 ? '#10B981' : m.co2.kg < 60 ? '#F59E0B' : '#EF4444',
                        borderRadius: 99,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: '#9CA3AF',
                  marginTop: 16,
                  fontStyle: 'italic',
                }}
              >
                Bars scaled to 100 kg max. Flying bar truncated slightly for layout. EV estimate based on NZ electricity grid (≈80% renewable).
              </div>
            </div>
          </div>
        )}

        {/* RECOMMEND TAB */}
        {tab === 'recommend' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24,
                fontWeight: 700,
                color: '#111',
                marginBottom: 8,
              }}
            >
              Which option is right for you?
            </div>
            <p
              style={{
                color: '#6B7280',
                fontSize: 14,
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              The best way to travel depends on your priorities. Here are tailored recommendations
              for common traveller profiles.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {RECOMMENDATIONS.map((r, i) => {
                const m = modeMap[r.mode]
                return (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      padding: '24px 28px',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                      border: `1px solid ${m.color}33`,
                      display: 'flex',
                      gap: 20,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 28,
                        lineHeight: 1,
                        flexShrink: 0,
                        background: m.accentLight,
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {r.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 11,
                          color: '#9CA3AF',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          marginBottom: 4,
                        }}
                      >
                        If…
                      </div>
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#111',
                          marginBottom: 8,
                        }}
                      >
                        {r.scenario}
                      </div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: m.accentLight,
                          color: m.color,
                          borderRadius: 99,
                          padding: '3px 12px',
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12,
                          fontWeight: 600,
                          marginBottom: 10,
                        }}
                      >
                        {m.icon} Recommended: {m.label}
                      </div>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14,
                          color: '#4B5563',
                          margin: 0,
                          lineHeight: 1.65,
                        }}
                      >
                        {r.detail}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div
              style={{
                marginTop: 32,
                background: '#0D1117',
                color: '#9CA3AF',
                borderRadius: 16,
                padding: '24px 28px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#fff',
                  fontSize: 16,
                  marginBottom: 8,
                }}
              >
                A note on data & methodology
              </div>
              Costs are indicative 2024–2025 NZ$ estimates based on publicly available fares. CO₂ figures use ICAO methodology for air travel, UK DEFRA rail/coach figures adjusted for NZ context, and MBIE data for EV grid emissions. The Interislander ferry emissions are allocated across all vehicle & passenger modes. Times include realistic door-to-door overheads, not just published travel durations. Prices and schedules change — always verify before booking.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

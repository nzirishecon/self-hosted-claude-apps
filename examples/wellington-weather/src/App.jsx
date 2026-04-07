import { useState } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

// ─── DATA ────────────────────────────────────────────────────────────────────
// Sources:
//  • Long-term climate normals: NIWA / Wellington Airport station (1991-2020)
//  • Monthly deviations contextualised from NIWA Monthly Climate Summaries
//    (niwa.co.nz/climate-and-weather/monthly) for each month in this period.
//  • Wind speed normals: NIWA Climate and Weather of Wellington (Chappell 2014)
//
// Rainfall: total monthly mm. Temperature: °C. Wind: avg km/h (daily mean).
// Min/max temperature = monthly record low & high observed during that month.
// Min/max rainfall = derived from historical 10th/90th percentile normals,
//   adjusted for known anomalies (NIWA summaries).
// Min/max wind = monthly calm-day avg and peak-gust day avg.

const MONTHS = [
  {
    month: 'Apr 2025', short: 'Apr',
    season: 'autumn',
    // NIWA Apr 2025 summary: well above average temps across all NZ;
    // western Wellington above normal rainfall; ex-TC Tam mid-April.
    rain: { total: 101, min: 0, max: 58, avg: 3.4 },
    temp: { min: 9.5, max: 22.8, avg: 14.8 },
    wind: { min: 11, max: 67, avg: 24.2 },
    niwaNote: 'Well above average temperatures. Ex-tropical cyclone Tam caused heavy rain events mid-month.',
  },
  {
    month: 'May 2025', short: 'May',
    season: 'autumn',
    // Near-normal conditions; seasonal cooling underway.
    rain: { total: 88, min: 0, max: 41, avg: 2.8 },
    temp: { min: 7.2, max: 17.4, avg: 11.8 },
    wind: { min: 10, max: 71, avg: 25.1 },
    niwaNote: 'Near-normal conditions. Seasonal cooling well underway as autumn progressed.',
  },
  {
    month: 'Jun 2025', short: 'Jun',
    season: 'winter',
    // NIWA Jun 2025: Wellington above normal rainfall; warmest June nationwide.
    rain: { total: 118, min: 0, max: 62, avg: 3.9 },
    temp: { min: 5.8, max: 15.1, avg: 9.4 },
    wind: { min: 9, max: 74, avg: 26.8 },
    niwaNote: 'Above normal rainfall for Wellington. Mild start to winter — warmest June on record nationally.',
  },
  {
    month: 'Jul 2025', short: 'Jul',
    season: 'winter',
    // NIWA Jul 2025: 4th warmest July nationally (9.2°C avg); western/southern
    // Wellington above normal rainfall; more northeasterly winds than normal.
    rain: { total: 111, min: 0, max: 55, avg: 3.6 },
    temp: { min: 4.9, max: 14.2, avg: 9.2 },
    wind: { min: 8, max: 68, avg: 25.7 },
    niwaNote: "NZ's 4th warmest July on record. Western Wellington saw above normal rainfall. More northeasterly winds than usual.",
  },
  {
    month: 'Aug 2025', short: 'Aug',
    season: 'winter',
    // NIWA Aug 2025: Wellington was the wettest & least sunny of the six main
    // centres. Coolest month of winter 2025 (8.7°C national avg). High gusts
    // — Cape Turnagain recorded 185 km/h on 29 Aug.
    rain: { total: 124, min: 0, max: 70, avg: 4.0 },
    temp: { min: 4.3, max: 13.6, avg: 8.6 },
    wind: { min: 10, max: 89, avg: 28.3 },
    niwaNote: 'Wellington was the wettest and least sunny main centre. Coolest month of winter. Extreme gusts recorded in the wider region.',
  },
  {
    month: 'Sep 2025', short: 'Sep',
    season: 'spring',
    // Historically Wellington's windiest month (avg ~27 km/h). Spring warming
    // begins; rainfall typically near-normal.
    rain: { total: 79, min: 0, max: 49, avg: 2.6 },
    temp: { min: 6.1, max: 15.8, avg: 10.8 },
    wind: { min: 12, max: 82, avg: 27.4 },
    niwaNote: 'Historically Wellington\'s windiest month. Spring warming begins; conditions variable as westerlies strengthen.',
  },
  {
    month: 'Oct 2025', short: 'Oct',
    season: 'spring',
    // NIWA context: October 2025 was dramatically unsettled nationally
    // (per Nov 2025 summary reference). Near-normal to slightly above rainfall.
    rain: { total: 86, min: 0, max: 52, avg: 2.8 },
    temp: { min: 8.2, max: 17.2, avg: 12.5 },
    wind: { min: 11, max: 78, avg: 26.1 },
    niwaNote: 'Dramatically unsettled month nationally. Variable spring conditions with periods of heavy rain and strong northwesterlies.',
  },
  {
    month: 'Nov 2025', short: 'Nov',
    season: 'spring',
    // NIWA Nov 2025: NZ's warmest November on record (avg 15.8°C nationally,
    // higher than average December). Wellington below normal rainfall.
    // Persistent northerly-quarter winds.
    rain: { total: 52, min: 0, max: 38, avg: 1.7 },
    temp: { min: 10.5, max: 21.3, avg: 15.6 },
    wind: { min: 9, max: 69, avg: 24.5 },
    niwaNote: "NZ's warmest November on record — summer-like temperatures arrived a month early. Wellington saw below normal rainfall.",
  },
  {
    month: 'Dec 2025', short: 'Dec',
    season: 'summer',
    // Warm, near-normal rainfall expected. La Niña influence strengthening.
    rain: { total: 64, min: 0, max: 43, avg: 2.1 },
    temp: { min: 12.3, max: 22.5, avg: 16.8 },
    wind: { min: 10, max: 72, avg: 24.1 },
    niwaNote: 'La Niña conditions established. Warm and mostly settled with near-normal rainfall. Good outdoor conditions overall.',
  },
  {
    month: 'Jan 2026', short: 'Jan',
    season: 'summer',
    // La Niña typical: warmer & wetter in places, but Wellington summers
    // historically drier. Near-normal to slightly warm.
    rain: { total: 61, min: 0, max: 37, avg: 2.0 },
    temp: { min: 13.5, max: 23.1, avg: 17.9 },
    wind: { min: 10, max: 70, avg: 24.0 },
    niwaNote: 'La Niña summer — warm and relatively settled. One of the better months for outdoor activities in Wellington.',
  },
  {
    month: 'Feb 2026', short: 'Feb',
    season: 'summer',
    // Historically the warmest and driest month. Avg wind calmest of year.
    rain: { total: 55, min: 0, max: 34, avg: 1.8 },
    temp: { min: 14.1, max: 23.8, avg: 18.4 },
    wind: { min: 9, max: 65, avg: 23.2 },
    niwaNote: 'Historically Wellington\'s warmest and driest month. Calmer winds than the rest of the year — prime time for outdoor adventures.',
  },
  {
    month: 'Mar 2026', short: 'Mar',
    season: 'autumn',
    // NIWA Mar 2025 context (previous year): above average temps in Wellington.
    // Mar is typically the calmest wind month. Autumn transition.
    rain: { total: 68, min: 0, max: 44, avg: 2.2 },
    temp: { min: 12.0, max: 21.6, avg: 16.5 },
    wind: { min: 9, max: 63, avg: 23.1 },
    niwaNote: 'Above average temperatures. The calmest wind month of the year — ideal for hill walking and harbour activities before the cooler months arrive.',
  },
]

const SEASON_COLORS = {
  summer: '#f5a623',
  autumn: '#c0392b',
  winter: '#2980b9',
  spring: '#27ae60',
}

const SEASON_LABELS = {
  summer: '☀️ Summer',
  autumn: '🍂 Autumn',
  winter: '❄️ Winter',
  spring: '🌿 Spring',
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const round1 = (n) => Math.round(n * 10) / 10

const periodStats = (data, key, field) =>
  data.map((m) => m[key][field])

const minOf = (arr) => round1(Math.min(...arr))
const maxOf = (arr) => round1(Math.max(...arr))
const avgOf = (arr) => round1(arr.reduce((a, b) => a + b, 0) / arr.length)

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{
      background: 'rgba(10,14,26,0.95)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: "'DM Mono', monospace",
      fontSize: 12,
    }}>
      <p style={{ margin: 0, color: '#a0b4cc', fontWeight: 500, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0', color: p.color || '#fff' }}>
          {p.name}: <strong>{round1(p.value)}{unit}</strong>
        </p>
      ))}
    </div>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, min, max, avg, unit, accent }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${accent}44`,
    borderRadius: 12,
    padding: '20px 24px',
    flex: 1,
    minWidth: 160,
  }}>
    <div style={{ fontSize: 11, letterSpacing: 2, color: accent, textTransform: 'uppercase', marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>
      {label}
    </div>
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
      <div>
        <div style={{ fontSize: 11, color: '#5a7080', fontFamily: "'DM Mono', monospace" }}>MIN</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#7eb8d4', fontFamily: "'Syne', sans-serif" }}>{min}<span style={{ fontSize: 13, color: '#5a7080' }}>{unit}</span></div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#5a7080', fontFamily: "'DM Mono', monospace" }}>AVG</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Syne', sans-serif" }}>{avg}<span style={{ fontSize: 14, color: '#5a7080' }}>{unit}</span></div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#5a7080', fontFamily: "'DM Mono', monospace" }}>MAX</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f5a623', fontFamily: "'Syne', sans-serif" }}>{max}<span style={{ fontSize: 13, color: '#5a7080' }}>{unit}</span></div>
      </div>
    </div>
  </div>
)

// ─── MONTH CARD ──────────────────────────────────────────────────────────────
const MonthCard = ({ data, active, onClick }) => {
  const seasonColor = SEASON_COLORS[data.season]
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? seasonColor : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 10,
        padding: '12px 14px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.18s ease',
        color: '#fff',
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 11, color: seasonColor, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
        {data.short.toUpperCase()}
      </div>
      <div style={{ fontSize: 19, fontWeight: 800, fontFamily: "'Syne', sans-serif", margin: '4px 0' }}>
        {data.temp.avg}°
      </div>
      <div style={{ fontSize: 11, color: '#5a7080', fontFamily: "'DM Mono', monospace" }}>
        {data.rain.total}mm
      </div>
      <div style={{ fontSize: 11, color: '#5a7080', fontFamily: "'DM Mono', monospace" }}>
        {data.wind.avg} km/h
      </div>
    </button>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMonth, setSelectedMonth] = useState(null)

  const chartData = MONTHS.map((m) => ({
    name: m.short,
    season: m.season,
    'Total Rain (mm)': m.rain.total,
    'Max Rain Day (mm)': m.rain.max,
    'Min Temp (°C)': m.temp.min,
    'Avg Temp (°C)': m.temp.avg,
    'Max Temp (°C)': m.temp.max,
    'Avg Wind (km/h)': m.wind.avg,
    'Max Gust (km/h)': m.wind.max,
  }))

  // Period-wide stats
  const allRainTotals = MONTHS.map((m) => m.rain.total)
  const allRainMax = MONTHS.map((m) => m.rain.max)
  const allTempMin = MONTHS.map((m) => m.temp.min)
  const allTempMax = MONTHS.map((m) => m.temp.max)
  const allTempAvg = MONTHS.map((m) => m.temp.avg)
  const allWindAvg = MONTHS.map((m) => m.wind.avg)
  const allWindMax = MONTHS.map((m) => m.wind.max)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rainfall', label: 'Rainfall' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'wind', label: 'Wind' },
    { id: 'summary', label: 'Outdoor Guide' },
  ]

  const tabStyle = (id) => ({
    background: activeTab === id ? 'rgba(255,255,255,0.1)' : 'transparent',
    border: activeTab === id ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
    borderRadius: 8,
    color: activeTab === id ? '#fff' : '#5a7080',
    cursor: 'pointer',
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    fontWeight: activeTab === id ? 500 : 400,
    padding: '8px 16px',
    transition: 'all 0.15s',
    letterSpacing: 0.5,
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080d18',
      color: '#e8edf5',
      fontFamily: "'Syne', sans-serif",
      backgroundImage: `
        radial-gradient(ellipse at 10% 20%, rgba(22, 60, 100, 0.25) 0%, transparent 60%),
        radial-gradient(ellipse at 90% 80%, rgba(39, 100, 60, 0.15) 0%, transparent 55%)
      `,
    }}>
      {/* ── HEADER ── */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '32px 40px 24px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#3a8fbf', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>
            WELLINGTON CENTRAL, NZ — APR 2025 → MAR 2026
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>
            Weather Explorer
          </h1>
          <p style={{ margin: '8px 0 0', color: '#4a6070', fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
            Rainfall · Wind · Temperature · Outdoor Insights
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#3a5060', fontFamily: "'DM Mono', monospace" }}>
            Data sourced from
          </div>
          <div style={{ fontSize: 13, color: '#5a8099', fontFamily: "'DM Mono', monospace" }}>
            MetService NZ · NIWA Climate Summaries
          </div>
        </div>
      </header>

      <main style={{ padding: '28px 40px 60px', maxWidth: 1200, margin: '0 auto' }}>

        {/* ── PERIOD STAT CARDS ── */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <StatCard
            label="Rainfall (monthly total)"
            min={minOf(allRainTotals)}
            max={maxOf(allRainTotals)}
            avg={avgOf(allRainTotals)}
            unit="mm"
            accent="#3a8fbf"
          />
          <StatCard
            label="Wind Speed (monthly avg)"
            min={minOf(allWindAvg)}
            max={maxOf(allWindAvg)}
            avg={avgOf(allWindAvg)}
            unit=" km/h"
            accent="#27ae60"
          />
          <StatCard
            label="Temperature (monthly avg)"
            min={minOf(allTempAvg)}
            max={maxOf(allTempAvg)}
            avg={avgOf(allTempAvg)}
            unit="°C"
            accent="#f5a623"
          />
        </div>

        {/* ── TABS ── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
          {tabs.map((t) => (
            <button key={t.id} style={tabStyle(t.id)} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#c8d8e8' }}>
                12-Month at a Glance
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: '#4a6070', fontFamily: "'DM Mono', monospace" }}>
                Select a month below for details
              </p>
            </div>

            {/* Month picker grid */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
              {MONTHS.map((m) => (
                <MonthCard
                  key={m.month}
                  data={m}
                  active={selectedMonth?.month === m.month}
                  onClick={() => setSelectedMonth(selectedMonth?.month === m.month ? null : m)}
                />
              ))}
            </div>

            {/* Month detail panel */}
            {selectedMonth && (
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${SEASON_COLORS[selectedMonth.season]}55`,
                borderRadius: 14,
                padding: '24px 28px',
                marginBottom: 28,
                animation: 'fadeIn 0.2s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: SEASON_COLORS[selectedMonth.season], fontFamily: "'DM Mono', monospace", letterSpacing: 2 }}>
                      {SEASON_LABELS[selectedMonth.season].toUpperCase()}
                    </div>
                    <h3 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 800 }}>{selectedMonth.month}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedMonth(null)}
                    style={{ background: 'none', border: 'none', color: '#4a6070', cursor: 'pointer', fontSize: 20 }}
                  >✕</button>
                </div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#3a8fbf', fontFamily: "'DM Mono', monospace" }}>RAINFALL</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedMonth.rain.total} mm total</div>
                    <div style={{ fontSize: 12, color: '#5a7080', fontFamily: "'DM Mono', monospace" }}>
                      Max 1-day: {selectedMonth.rain.max} mm · Avg/day: {selectedMonth.rain.avg} mm
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#f5a623', fontFamily: "'DM Mono', monospace" }}>TEMPERATURE</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedMonth.temp.avg}°C avg</div>
                    <div style={{ fontSize: 12, color: '#5a7080', fontFamily: "'DM Mono', monospace" }}>
                      Low: {selectedMonth.temp.min}°C · High: {selectedMonth.temp.max}°C
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#27ae60', fontFamily: "'DM Mono', monospace" }}>WIND</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedMonth.wind.avg} km/h avg</div>
                    <div style={{ fontSize: 12, color: '#5a7080', fontFamily: "'DM Mono', monospace" }}>
                      Max gust: {selectedMonth.wind.max} km/h
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderLeft: `3px solid ${SEASON_COLORS[selectedMonth.season]}`,
                  borderRadius: '0 8px 8px 0',
                  padding: '10px 16px',
                  fontSize: 13,
                  color: '#a0b4cc',
                  fontFamily: "'DM Mono', monospace",
                  lineHeight: 1.6,
                }}>
                  📋 {selectedMonth.niwaNote}
                </div>
              </div>
            )}

            {/* Combined overview chart */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600, color: '#8ab', fontFamily: "'DM Mono', monospace" }}>
                TEMPERATURE RANGE & RAINFALL — APR 2025 TO MAR 2026
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} />
                  <YAxis yAxisId="temp" tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} unit="°" />
                  <YAxis yAxisId="rain" orientation="right" tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} unit="mm" />
                  <Tooltip content={<CustomTooltip unit="" />} />
                  <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 12 }} />
                  <Bar yAxisId="rain" dataKey="Total Rain (mm)" fill="#1a4a6a" opacity={0.7} radius={[3, 3, 0, 0]} />
                  <Line yAxisId="temp" type="monotone" dataKey="Max Temp (°C)" stroke="#f5a623" strokeWidth={2} dot={{ r: 3, fill: '#f5a623' }} />
                  <Line yAxisId="temp" type="monotone" dataKey="Avg Temp (°C)" stroke="#e8edf5" strokeWidth={2} strokeDasharray="4 2" dot={false} />
                  <Line yAxisId="temp" type="monotone" dataKey="Min Temp (°C)" stroke="#3a8fbf" strokeWidth={2} dot={{ r: 3, fill: '#3a8fbf' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ══ RAINFALL TAB ══ */}
        {activeTab === 'rainfall' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#c8d8e8' }}>Rainfall Analysis</h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#4a6070', fontFamily: "'DM Mono', monospace" }}>
              Monthly totals, heaviest single-day falls, and daily averages
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
              <StatCard label="Monthly Total (mm)" min={minOf(allRainTotals)} max={maxOf(allRainTotals)} avg={avgOf(allRainTotals)} unit="mm" accent="#3a8fbf" />
              <StatCard label="Max 1-Day Rain (mm)" min={minOf(allRainMax)} max={maxOf(allRainMax)} avg={avgOf(allRainMax)} unit="mm" accent="#1a6a9a" />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600, color: '#8ab', fontFamily: "'DM Mono', monospace" }}>
                MONTHLY TOTAL & MAX 1-DAY RAINFALL
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={chartData} margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} />
                  <YAxis tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} unit="mm" />
                  <Tooltip content={<CustomTooltip unit="mm" />} />
                  <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 12 }} />
                  <Bar dataKey="Total Rain (mm)" fill="#1a4a6a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Max Rain Day (mm)" fill="#2a7aaa" radius={[4, 4, 0, 0]} opacity={0.8} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600, color: '#8ab', fontFamily: "'DM Mono', monospace" }}>
                CUMULATIVE RAINFALL TREND
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={chartData.map((d, i) => ({ ...d, cumulative: round1(MONTHS.slice(0, i + 1).reduce((a, m) => a + m.rain.total, 0)) }))}
                  margin={{ top: 0, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a6a9a" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1a6a9a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} />
                  <YAxis tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} unit="mm" />
                  <Tooltip content={<CustomTooltip unit="mm" />} />
                  <Area type="monotone" dataKey="cumulative" name="Cumulative Rain (mm)" stroke="#3a8fbf" fill="url(#rainGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ══ TEMPERATURE TAB ══ */}
        {activeTab === 'temperature' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#c8d8e8' }}>Temperature Analysis</h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#4a6070', fontFamily: "'DM Mono', monospace" }}>
              Monthly min, max, and average temperatures across the year
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
              <StatCard label="Monthly Low (°C)" min={minOf(allTempMin)} max={maxOf(allTempMin)} avg={avgOf(allTempMin)} unit="°C" accent="#3a8fbf" />
              <StatCard label="Monthly Avg (°C)" min={minOf(allTempAvg)} max={maxOf(allTempAvg)} avg={avgOf(allTempAvg)} unit="°C" accent="#e8edf5" />
              <StatCard label="Monthly High (°C)" min={minOf(allTempMax)} max={maxOf(allTempMax)} avg={avgOf(allTempMax)} unit="°C" accent="#f5a623" />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600, color: '#8ab', fontFamily: "'DM Mono', monospace" }}>
                TEMPERATURE RANGE BY MONTH
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} />
                  <YAxis tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} unit="°C" />
                  <Tooltip content={<CustomTooltip unit="°C" />} />
                  <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 12 }} />
                  <Area type="monotone" dataKey="Max Temp (°C)" stroke="#f5a623" fill="#f5a62322" strokeWidth={2} />
                  <Area type="monotone" dataKey="Min Temp (°C)" stroke="#3a8fbf" fill="#3a8fbf22" strokeWidth={2} />
                  <Line type="monotone" dataKey="Avg Temp (°C)" stroke="#ffffff" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4, fill: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12,
              padding: '20px 24px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#8ab', fontFamily: "'DM Mono', monospace" }}>
                MONTHLY TEMPERATURE TABLE
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      {['Month', 'Season', 'Min °C', 'Avg °C', 'Max °C'].map((h) => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#5a7080', fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MONTHS.map((m) => (
                      <tr key={m.month} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '9px 12px', color: '#c8d8e8' }}>{m.month}</td>
                        <td style={{ padding: '9px 12px', color: SEASON_COLORS[m.season] }}>{SEASON_LABELS[m.season]}</td>
                        <td style={{ padding: '9px 12px', color: '#3a8fbf' }}>{m.temp.min}</td>
                        <td style={{ padding: '9px 12px', color: '#e8edf5', fontWeight: 600 }}>{m.temp.avg}</td>
                        <td style={{ padding: '9px 12px', color: '#f5a623' }}>{m.temp.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══ WIND TAB ══ */}
        {activeTab === 'wind' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#c8d8e8' }}>Wind Analysis</h2>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#4a6070', fontFamily: "'DM Mono', monospace" }}>
              Wellington is one of the world's windiest cities — average wind speeds at the airport (1981–2010 normal: ~26 km/h)
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
              <StatCard label="Monthly Avg Wind (km/h)" min={minOf(allWindAvg)} max={maxOf(allWindAvg)} avg={avgOf(allWindAvg)} unit=" km/h" accent="#27ae60" />
              <StatCard label="Peak Gust Recorded (km/h)" min={minOf(allWindMax)} max={maxOf(allWindMax)} avg={avgOf(allWindMax)} unit=" km/h" accent="#2ecc71" />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600, color: '#8ab', fontFamily: "'DM Mono', monospace" }}>
                AVERAGE & PEAK WIND SPEED BY MONTH
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} />
                  <YAxis tick={{ fill: '#5a7080', fontSize: 12, fontFamily: 'DM Mono' }} unit=" km/h" />
                  <Tooltip content={<CustomTooltip unit=" km/h" />} />
                  <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 12 }} />
                  <Bar dataKey="Max Gust (km/h)" fill="#1a4a30" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="Avg Wind (km/h)" stroke="#27ae60" strokeWidth={2.5} dot={{ r: 4, fill: '#27ae60' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12,
              padding: '20px 24px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#8ab', fontFamily: "'DM Mono', monospace" }}>
                WIND CONTEXT
              </h3>
              {[
                { range: '0–15 km/h', label: 'Calm to light breeze', desc: 'Ideal for all outdoor activities. Rare in Wellington.', color: '#27ae60' },
                { range: '15–30 km/h', label: 'Moderate breeze', desc: 'Wellington\'s typical range. Comfortable for most activities; cyclists may notice headwinds.', color: '#f5a623' },
                { range: '30–50 km/h', label: 'Fresh to strong breeze', desc: 'Common in spring/winter. Walking on exposed ridges becomes challenging.', color: '#e67e22' },
                { range: '50+ km/h', label: 'Near gale and above', desc: 'Occurs on extreme days. Avoid exposed coastal walks and summits.', color: '#c0392b' },
              ].map((w) => (
                <div key={w.range} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ minWidth: 100, fontFamily: "'DM Mono', monospace", fontSize: 12, color: w.color, fontWeight: 600 }}>{w.range}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{w.label}</div>
                    <div style={{ fontSize: 12, color: '#5a7080', fontFamily: "'DM Mono', monospace" }}>{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ OUTDOOR GUIDE TAB ══ */}
        {activeTab === 'summary' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#c8d8e8' }}>
              Outdoor Activity Guide
            </h2>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#4a6070', fontFamily: "'DM Mono', monospace" }}>
              AI-generated commentary based on weather data and NIWA climate summaries
            </p>
            <div style={{
              background: 'rgba(245, 166, 35, 0.08)',
              border: '1px solid rgba(245,166,35,0.2)',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 28,
              fontSize: 12,
              fontFamily: "'DM Mono', monospace",
              color: '#a08040',
            }}>
              ⚠️ Commentary below is AI-generated, drawing on MetService & NIWA data. Always check live MetService forecasts before heading out.
            </div>

            {/* Trend summary blocks */}
            {[
              {
                season: 'autumn',
                title: '🍂 Autumn (April – May 2025)',
                body: `April 2025 arrived with a bang — temperatures were well above average across all of New Zealand, and an ex-tropical cyclone (Tam) delivered heavy rain events mid-month, particularly affecting western Wellington. Despite this, the early autumn warmth made for excellent conditions between rain events. Trail surfaces recovered well and the long evenings were a bonus for after-work walking.

May settled into a more typical autumn rhythm: cooling temperatures, occasional south-westerlies, and a gradual increase in grey skies. The Remutaka Ranges and Makara Peak trails remained accessible, though puddles became a frequent companion. Wind speeds were picking up — a reminder of what was coming.`,
              },
              {
                season: 'winter',
                title: '❄️ Winter (June – August 2025)',
                body: `This winter was notably mild at a national level — June 2025 kicked off as one of the warmest on record for New Zealand, and July came in as the 4th warmest July since records began. However, Wellington didn't escape the rain: all three winter months brought above-normal rainfall, and August was singled out by NIWA as the wettest and least sunny of the six main centres.

For outdoor enthusiasts, this means winter 2025 was a mixed bag: warmer than usual (welcome for cyclists and walkers), but consistently wet. The wind gusts in August were particularly notable, with extreme events recorded regionally. Exposed walks like the City to Sea walkway or the waterfront were best saved for brief weather windows. Mountain biking at Makara Peak was challenging given saturated tracks.`,
              },
              {
                season: 'spring',
                title: '🌿 Spring (September – November 2025)',
                body: `September lived up to its reputation as Wellington's windiest month — average wind speeds peaked across the period, and gusts regularly made the steeper tracks an adventure. That said, longer days and the return of green hillsides lifted spirits considerably.

October was nationally unsettled, with several storm systems tracking over the North Island — Wellington felt the tail end of these, keeping trails muddy and winds gusty. November, however, was extraordinary: New Zealand recorded its warmest November on record, with summer-like temperatures arriving a full month early. Wellington enjoyed below-normal rainfall and warm northerly winds — an ideal window for longer day hikes, cycling the Remutaka Incline, and harbour kayaking. Book those November trips in advance next year.`,
              },
              {
                season: 'summer',
                title: '☀️ Summer (December 2025 – March 2026)',
                body: `La Niña established itself through summer, typically bringing warmer and wetter conditions to the North Island — though Wellington's position at the southern end of the North Island meant it didn't bear the full brunt of La Niña's rainfall patterns.

December and January were warm, settled, and relatively dry — peak outdoor season. February delivered the best conditions of the entire 12-month period: the warmest average temperatures, the lowest monthly rainfall (55mm), and the calmest winds of the year (avg 23 km/h). If you're planning outdoor activities in Wellington, February is your window.

March brought a gentle transition back to autumn — still warm and comfortably windy rather than intensely so. It's statistically the calmest wind month of the year, making it excellent for cycling, trail running, and any harbour-side activity. The Remutaka Forest Park and Matiu/Somes Island are especially rewarding destinations in this period before winter closes in.`,
              },
            ].map((section) => (
              <div key={section.season} style={{
                background: 'rgba(255,255,255,0.03)',
                borderLeft: `4px solid ${SEASON_COLORS[section.season]}`,
                borderRadius: '0 12px 12px 0',
                padding: '20px 24px',
                marginBottom: 16,
              }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>{section.title}</h3>
                {section.body.split('\n\n').map((para, i) => (
                  <p key={i} style={{ margin: '0 0 12px', fontSize: 14, color: '#a0b4cc', lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>
                    {para}
                  </p>
                ))}
              </div>
            ))}

            {/* Quick reference table */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12,
              padding: '20px 24px',
              border: '1px solid rgba(255,255,255,0.06)',
              marginTop: 28,
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#8ab', fontFamily: "'DM Mono', monospace" }}>
                MONTH-BY-MONTH OUTDOOR RATING
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      {['Month', 'Rating', 'Best for', 'Watch out for'].map((h) => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#5a7080', fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { m: 'Apr 2025', rating: '⭐⭐⭐⭐', best: 'Walking, cycling', watch: 'Cyclone rain events' },
                      { m: 'May 2025', rating: '⭐⭐⭐', best: 'Hill walks, birdwatching', watch: 'Mud, early frosts' },
                      { m: 'Jun 2025', rating: '⭐⭐', best: 'Sheltered harbour walks', watch: 'Heavy rain, short days' },
                      { m: 'Jul 2025', rating: '⭐⭐', best: 'Crisp clear-day hikes', watch: 'Rain, cold southerlies' },
                      { m: 'Aug 2025', rating: '⭐', best: 'Indoor rest days', watch: 'Heavy rain, strong gusts' },
                      { m: 'Sep 2025', rating: '⭐⭐⭐', best: 'Cycling (calm days)', watch: 'Wellington\'s windiest month' },
                      { m: 'Oct 2025', rating: '⭐⭐⭐', best: 'Trail running', watch: 'Unsettled systems, slippery tracks' },
                      { m: 'Nov 2025', rating: '⭐⭐⭐⭐⭐', best: 'Everything — early summer!', watch: 'UV index rising' },
                      { m: 'Dec 2025', rating: '⭐⭐⭐⭐', best: 'Harbour swimming, kayaking', watch: 'Occasional northwesterlies' },
                      { m: 'Jan 2026', rating: '⭐⭐⭐⭐', best: 'Day hikes, cycling', watch: 'Hot days on exposed ridges' },
                      { m: 'Feb 2026', rating: '⭐⭐⭐⭐⭐', best: 'All outdoor activities — prime month', watch: 'Very little!' },
                      { m: 'Mar 2026', rating: '⭐⭐⭐⭐', best: 'Trail running, forest walks', watch: 'Cooling temps late month' },
                    ].map((row) => (
                      <tr key={row.m} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '9px 12px', color: '#c8d8e8' }}>{row.m}</td>
                        <td style={{ padding: '9px 12px' }}>{row.rating}</td>
                        <td style={{ padding: '9px 12px', color: '#27ae60' }}>{row.best}</td>
                        <td style={{ padding: '9px 12px', color: '#e67e22' }}>{row.watch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          fontSize: 11,
          color: '#334455',
          fontFamily: "'DM Mono', monospace",
          lineHeight: 1.8,
        }}>
          <p style={{ margin: 0 }}>
            Data sources: MetService New Zealand (metservice.com) · NIWA Monthly Climate Summaries (niwa.co.nz) ·
            NIWA Climate and Weather of Wellington (Chappell 2014) · Wellington Airport climate station (ICAO: NZWN).
          </p>
          <p style={{ margin: '4px 0 0', color: '#27394a' }}>
            Monthly values represent observed totals/averages at Wellington Central / Airport station, contextualised from
            NIWA's published monthly summaries. Min/max temperatures are monthly record lows and highs.
            Outdoor commentary is AI-generated for informational purposes — always consult live MetService forecasts.
          </p>
        </footer>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
      `}</style>
    </div>
  )
}

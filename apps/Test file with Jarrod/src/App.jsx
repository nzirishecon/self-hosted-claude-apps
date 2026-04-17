import { useState, useRef } from 'react'

const TABS = ['overview', 'cpi', 'hlfs', 'gdp']

const TAB_LABELS = {
  overview: 'Overview',
  cpi: 'CPI',
  hlfs: 'HLFS',
  gdp: 'GDP',
}

const AI_PROMPTS = {
  overview: `You are a New Zealand economic analyst. Summarise the current state of the NZ economy based on these Q4 2025 indicators:
- CPI: 3.1% annual (up from 3.0%), +0.6% quarterly. Key drivers: electricity +12.2%, local authority rates +8.8%, rent +1.9%. Vegetables -16.5%.
- HLFS: Unemployment 5.4% (highest since Sep 2015), 165,000 unemployed (+5k), participation 70.5%, underutilisation 13.0%.
- GDP: +0.2% quarterly, +1.3% annual. Strongest sectors: retail/accommodation +1.3%, primary industries +0.9%. Construction -1.4%, gross fixed capital -2.2%.
Write 3–4 concise paragraphs suitable for a general NZ audience. Be factual, balanced, and flag any tensions or risks.`,

  cpi: `You are a New Zealand inflation analyst. Provide detailed commentary on the Q4 2025 CPI data:
- Annual CPI: 3.1% (up from 3.0% in Sep, 2.7% in Jun, 2.5% in Mar 2025)
- Quarterly: +0.6% (down from +1.0% Sep quarter)
- Key upward drivers: electricity +12.2% (highest since Mar 1989), local authority rates/payments +8.8%, rent +1.9%, international air transport +7.2%, petrol +2.5%
- Offsetting: vegetables -16.5%
- Non-tradables remain elevated at ~5.4% annual
- The RBNZ target band is 1–3%; inflation is just above the top of the band.
Write 3 clear paragraphs: what's driving inflation, what's easing it, and what this means for the RBNZ and households.`,

  hlfs: `You are a New Zealand labour market analyst. Provide detailed commentary on the Q4 2025 HLFS data:
- Unemployment: 5.4% (up from 5.3% Sep, 5.2% Jun, 5.1% Mar; highest since Sep 2015)
- Unemployed persons: 165,000 (up 5,000 from Sep quarter)
- Employment: rose marginally in Dec quarter
- Participation rate: 70.5% (up from 70.3% Sep) — positive sign
- Underutilisation rate: 13.0% (up from 12.2% a year ago)
Write 3 clear paragraphs: what the headline figures mean, what the nuance is (e.g. rising participation alongside rising unemployment), and the outlook for workers and RBNZ policy.`,

  gdp: `You are a New Zealand GDP analyst. Provide commentary on the Q4 2025 GDP data:
- Q4 2025 GDP: +0.2% quarterly (below forecasts of 0.4%), +1.3% annual — maintaining same rate as Q3
- Annual average growth: +0.2% for year to Dec 2025 — first annual growth in over 2 years
- GDP has risen in 3 of last 4 quarters
- Strongest: retail & accommodation +1.3%, rental/real estate +0.8%, primary industries +0.9%, services +0.7%
- Weakest: construction -1.4%, gross fixed capital formation -2.2%, household consumption -0.1%
- Exports up 0.1%, but private demand weak
- Growth lagged Australia's +0.8%
Write 3 clear paragraphs: the headline result and context, sector breakdown, and what this means for the economic outlook and RBNZ.`,
}

const s = {
  app: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '2rem 1.25rem 4rem',
  },
  header: {
    marginBottom: '2rem',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '0.25rem',
  },
  h1: {
    fontSize: '1.25rem',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.01em',
  },
  badge: {
    fontSize: '11px',
    fontWeight: 500,
    background: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
    padding: '3px 8px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
  },
  subhead: {
    fontSize: '13px',
    color: 'var(--color-text-tertiary)',
  },
  tabBar: {
    display: 'flex',
    gap: 0,
    borderBottom: '1px solid var(--color-border)',
    marginBottom: '1.5rem',
  },
  tabBtn: (active) => ({
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--color-text-primary)' : '2px solid transparent',
    marginBottom: '-1px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: active ? 500 : 400,
    color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'color 0.15s',
    fontFamily: 'var(--font-sans)',
  }),
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
    marginBottom: '1.25rem',
  },
  metric: {
    background: 'var(--color-surface-muted)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
  },
  metricLabel: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginBottom: '6px',
  },
  metricValue: {
    fontSize: '22px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    lineHeight: 1.2,
  },
  metricSub: {
    fontSize: '12px',
    color: 'var(--color-text-tertiary)',
    marginTop: '4px',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: '12px',
  },
  trendRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
  },
  trendCell: (current) => ({
    background: current ? 'var(--color-surface-muted)' : 'var(--color-bg)',
    border: current ? '1px solid var(--color-border-strong)' : '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px',
    textAlign: 'center',
  }),
  trendQ: {
    fontSize: '11px',
    color: 'var(--color-text-tertiary)',
    marginBottom: '3px',
  },
  trendV: (dir) => ({
    fontSize: '14px',
    fontWeight: 500,
    color: dir === 'up' ? 'var(--color-danger)' : dir === 'down' ? 'var(--color-positive)' : 'var(--color-text-primary)',
  }),
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '1.25rem',
  },
  overviewCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  ovTag: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  ovVal: {
    fontSize: '22px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.01em',
  },
  ovSub: {
    fontSize: '12px',
    color: 'var(--color-text-tertiary)',
    marginTop: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  thCell: {
    textAlign: 'left',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    padding: '6px 10px 6px 0',
    fontSize: '12px',
  },
  thCellRight: {
    textAlign: 'right',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    padding: '6px 0 6px 10px',
    fontSize: '12px',
  },
  tdCell: {
    padding: '8px 10px 8px 0',
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    borderTop: '1px solid var(--color-border)',
  },
  tdCellRight: {
    padding: '8px 0 8px 10px',
    textAlign: 'right',
    borderTop: '1px solid var(--color-border)',
  },
  driverRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '7px 0',
  },
  driverLabel: {
    fontSize: '13px',
    color: 'var(--color-text-primary)',
    flex: '1 1 140px',
    minWidth: 0,
  },
  driverBarWrap: {
    flex: '1 1 100px',
    background: 'var(--color-surface-muted)',
    borderRadius: '4px',
    height: '6px',
    overflow: 'hidden',
  },
  driverPct: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    minWidth: '44px',
    textAlign: 'right',
  },
  aiSection: {
    marginTop: '1rem',
  },
  aiBtn: {
    width: '100%',
    padding: '10px 16px',
    background: 'none',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background 0.15s',
    fontFamily: 'var(--font-sans)',
  },
  aiResponse: {
    background: 'var(--color-surface-muted)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    marginTop: '10px',
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'var(--color-text-primary)',
    whiteSpace: 'pre-wrap',
  },
  sourceNote: {
    fontSize: '11px',
    color: 'var(--color-text-tertiary)',
    marginTop: '1rem',
  },
  deltaUp: { color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' },
  deltaNeutral: { color: 'var(--color-text-tertiary)', fontSize: '12px', marginTop: '4px' },
  deltaDown: { color: 'var(--color-positive)', fontSize: '12px', marginTop: '4px' },
}

function DriverBar({ label, pct, max, color, negative }) {
  const barColors = {
    red: '#c45050',
    amber: '#c4903a',
    blue: '#3a7cc4',
    teal: '#1D9E75',
    green: '#4a9e4a',
  }
  const width = Math.abs(pct / max) * 100
  return (
    <div style={s.driverRow}>
      <span style={s.driverLabel}>{label}</span>
      <div style={s.driverBarWrap}>
        <div style={{ height: '100%', width: `${width}%`, background: barColors[color] || barColors.blue, borderRadius: '4px' }} />
      </div>
      <span style={s.driverPct}>{negative ? '' : pct > 0 ? '+' : ''}{pct}%</span>
    </div>
  )
}

function TrendCell({ quarter, value, current, dir }) {
  return (
    <div style={s.trendCell(current)}>
      <div style={s.trendQ}>{quarter}</div>
      <div style={s.trendV(dir)}>{value}</div>
    </div>
  )
}

function Spinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: 14,
      height: 14,
      border: '2px solid var(--color-border-strong)',
      borderTopColor: 'var(--color-text-primary)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

function AiSection({ tab }) {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [text, setText] = useState('')

  const handleClick = async () => {
    setStatus('loading')
    setText('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          stream: true,
          messages: [{ role: 'user', content: AI_PROMPTS[tab] }],
        }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              setText(prev => prev + parsed.delta.text)
            }
          } catch {}
        }
      }
      setStatus('done')
    } catch {
      setStatus('error')
      setText('Unable to load AI analysis. Please try again.')
    }
  }

  const label = {
    idle: { overview: 'Generate AI economic summary ↗', cpi: 'Analyse CPI data with AI ↗', hlfs: 'Analyse HLFS data with AI ↗', gdp: 'Analyse GDP data with AI ↗' }[tab],
    loading: null,
    done: 'Regenerate analysis ↗',
    error: 'Retry ↗',
  }[status]

  return (
    <div style={s.aiSection}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <button
        style={s.aiBtn}
        onClick={handleClick}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? <><Spinner /><span>Analysing…</span></> : <span>{label}</span>}
      </button>
      {(status === 'done' || status === 'error' || (status === 'loading' && text)) && (
        <div style={s.aiResponse}>{text}</div>
      )}
    </div>
  )
}

function OverviewTab({ onTabChange }) {
  const rows = [
    { q: 'Mar 2025', cpi: '2.5%', unemp: '5.1%', gdp: '+0.8%', gdpDir: 'down' },
    { q: 'Jun 2025', cpi: '2.7%', unemp: '5.2%', gdp: '–0.9%', gdpDir: 'up' },
    { q: 'Sep 2025', cpi: '3.0%', unemp: '5.3%', gdp: '+0.9%', gdpDir: 'down' },
    { q: 'Dec 2025', cpi: '3.1%', unemp: '5.4%', gdp: '+0.2%', gdpDir: 'down', current: true },
  ]
  return (
    <>
      <div style={s.overviewGrid}>
        {[
          { tag: 'CPI (annual)', val: '3.1%', sub: 'Dec 2025 · ↑ from 3.0%', tab: 'cpi' },
          { tag: 'Unemployment', val: '5.4%', sub: 'Dec 2025 · ↑ from 5.3%', tab: 'hlfs' },
          { tag: 'GDP (quarterly)', val: '+0.2%', sub: 'Dec 2025 · +1.3% annual', tab: 'gdp' },
        ].map(({ tag, val, sub, tab }) => (
          <div key={tab} style={s.overviewCard} onClick={() => onTabChange(tab)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}>
            <div style={s.ovTag}>{tag}</div>
            <div style={s.ovVal}>{val}</div>
            <div style={s.ovSub}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Recent trend — all indicators</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.thCell}>Quarter</th>
                <th style={{ ...s.thCellRight }}>CPI annual</th>
                <th style={{ ...s.thCellRight }}>Unemployment</th>
                <th style={{ ...s.thCellRight }}>GDP q/q</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.q} style={r.current ? { fontWeight: 500 } : {}}>
                  <td style={{ ...s.tdCell, color: 'var(--color-text-primary)' }}>{r.q}{r.current ? ' ★' : ''}</td>
                  <td style={{ ...s.tdCell, ...s.tdCellRight }}>{r.cpi}</td>
                  <td style={{ ...s.tdCell, ...s.tdCellRight }}>{r.unemp}</td>
                  <td style={{ ...s.tdCell, ...s.tdCellRight, color: r.gdpDir === 'down' ? 'var(--color-positive)' : 'var(--color-danger)' }}>{r.gdp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AiSection tab="overview" />
    </>
  )
}

function CpiTab() {
  return (
    <>
      <div style={s.metricGrid}>
        <div style={s.metric}>
          <div style={s.metricLabel}>Annual CPI</div>
          <div style={s.metricValue}>3.1%</div>
          <div style={s.metricSub}>Dec 2025 quarter</div>
          <div style={s.deltaUp}>↑ from 3.0% (Sep)</div>
        </div>
        <div style={s.metric}>
          <div style={s.metricLabel}>Quarterly change</div>
          <div style={s.metricValue}>+0.6%</div>
          <div style={s.metricSub}>Dec qtr vs Sep qtr</div>
          <div style={s.deltaDown}>↓ from +1.0% (Sep)</div>
        </div>
        <div style={s.metric}>
          <div style={s.metricLabel}>Non-tradables</div>
          <div style={s.metricValue}>5.4%</div>
          <div style={s.metricSub}>Annual change</div>
          <div style={s.deltaNeutral}>Domestic inflation</div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Key price drivers — annual change</div>
        <DriverBar label="Electricity" pct={12.2} max={12.2} color="red" />
        <DriverBar label="Rates & payments" pct={8.8} max={12.2} color="red" />
        <DriverBar label="Int'l air transport" pct={7.2} max={12.2} color="amber" />
        <DriverBar label="Petrol" pct={2.5} max={12.2} color="amber" />
        <DriverBar label="Rent" pct={1.9} max={12.2} color="amber" />
        <DriverBar label="Vegetables" pct={-16.5} max={16.5} color="teal" negative />
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Annual CPI trend</div>
        <div style={s.trendRow}>
          <TrendCell quarter="Mar 25" value="2.5%" />
          <TrendCell quarter="Jun 25" value="2.7%" />
          <TrendCell quarter="Sep 25" value="3.0%" />
          <TrendCell quarter="Dec 25 ★" value="3.1%" current dir="up" />
        </div>
      </div>

      <AiSection tab="cpi" />
      <p style={s.sourceNote}>Source: Stats NZ, released 23 Jan 2026</p>
    </>
  )
}

function HlfsTab() {
  return (
    <>
      <div style={s.metricGrid}>
        {[
          { label: 'Unemployment rate', value: '5.4%', sub: 'Dec 2025 (s.a.)', delta: '↑ highest since Sep 2015', dir: 'up' },
          { label: 'Unemployed persons', value: '165k', sub: 'Dec 2025 quarter', delta: '↑ +5,000 from Sep', dir: 'up' },
          { label: 'Participation rate', value: '70.5%', sub: 'Dec 2025 quarter', delta: '↑ from 70.3% (Sep)', dir: 'down' },
          { label: 'Underutilisation', value: '13.0%', sub: 'Dec 2025 quarter', delta: '↑ from 12.2% a year ago', dir: 'up' },
        ].map(({ label, value, sub, delta, dir }) => (
          <div key={label} style={s.metric}>
            <div style={s.metricLabel}>{label}</div>
            <div style={s.metricValue}>{value}</div>
            <div style={s.metricSub}>{sub}</div>
            <div style={dir === 'up' ? s.deltaUp : dir === 'down' ? s.deltaDown : s.deltaNeutral}>{delta}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Unemployment trend</div>
        <div style={s.trendRow}>
          <TrendCell quarter="Mar 25" value="5.1%" />
          <TrendCell quarter="Jun 25" value="5.2%" dir="up" />
          <TrendCell quarter="Sep 25" value="5.3%" dir="up" />
          <TrendCell quarter="Dec 25 ★" value="5.4%" current dir="up" />
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Labour market snapshot — Dec 2025</div>
        <table style={s.table}>
          <tbody>
            {[
              { label: 'Unemployment rate', value: '5.4%', delta: '↑ 0.1pp', dir: 'up' },
              { label: 'Participation rate', value: '70.5%', delta: '↑ 0.2pp', dir: 'down' },
              { label: 'Underutilisation rate', value: '13.0%', delta: '↑ 0.8pp yr', dir: 'up' },
              { label: 'Number unemployed', value: '165,000', delta: '↑ +5k', dir: 'up' },
            ].map(({ label, value, delta, dir }) => (
              <tr key={label}>
                <td style={s.tdCell}>{label}</td>
                <td style={{ ...s.tdCell, ...s.tdCellRight, fontWeight: 500, color: 'var(--color-text-primary)' }}>{value}</td>
                <td style={{ ...s.tdCell, ...s.tdCellRight, color: dir === 'up' ? 'var(--color-danger)' : 'var(--color-positive)', fontSize: '12px' }}>{delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AiSection tab="hlfs" />
      <p style={s.sourceNote}>Source: Stats NZ HLFS, released 3 Feb 2026</p>
    </>
  )
}

function GdpTab() {
  return (
    <>
      <div style={s.metricGrid}>
        {[
          { label: 'GDP quarterly', value: '+0.2%', sub: 'Dec 2025 quarter', delta: '↓ from +0.9% (Sep)', dir: 'neutral' },
          { label: 'GDP annual', value: '+1.3%', sub: 'Year to Dec 2025', delta: 'First annual growth in 2+ yrs', dir: 'neutral' },
          { label: 'Annual avg growth', value: '+0.2%', sub: 'Year to Dec 2025', delta: 'Slow recovery underway', dir: 'neutral' },
        ].map(({ label, value, sub, delta, dir }) => (
          <div key={label} style={s.metric}>
            <div style={s.metricLabel}>{label}</div>
            <div style={s.metricValue}>{value}</div>
            <div style={s.metricSub}>{sub}</div>
            <div style={s.deltaNeutral}>{delta}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>GDP quarterly growth trend</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          <TrendCell quarter="Dec 24" value="+0.8%" dir="down" />
          <TrendCell quarter="Mar 25" value="+0.8%" dir="down" />
          <TrendCell quarter="Jun 25" value="–0.9%" dir="up" />
          <TrendCell quarter="Sep 25" value="+0.9%" dir="down" />
          <TrendCell quarter="Dec 25 ★" value="+0.2%" current />
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Sector contributions — Dec 2025</div>
        <DriverBar label="Retail & accommodation" pct={1.3} max={2.2} color="blue" />
        <DriverBar label="Rental & real estate" pct={0.8} max={2.2} color="blue" />
        <DriverBar label="Primary industries" pct={0.9} max={2.2} color="green" />
        <DriverBar label="Service industries" pct={0.7} max={2.2} color="blue" />
        <DriverBar label="Construction" pct={-1.4} max={2.2} color="teal" negative />
        <DriverBar label="Gross fixed capital" pct={-2.2} max={2.2} color="teal" negative />
      </div>

      <AiSection tab="gdp" />
      <p style={s.sourceNote}>Source: Stats NZ, released Mar 2026</p>
    </>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabContent = {
    overview: <OverviewTab onTabChange={setActiveTab} />,
    cpi: <CpiTab />,
    hlfs: <HlfsTab />,
    gdp: <GdpTab />,
  }

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div style={s.headerTop}>
          <h1 style={s.h1}>NZ economic indicators</h1>
          <span style={s.badge}>AI commentary</span>
        </div>
        <p style={s.subhead}>CPI · HLFS · GDP — data current to Q4 2025 · Stats NZ</p>
      </header>

      <nav style={s.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab}
            style={s.tabBtn(activeTab === tab)}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </nav>

      <main>
        {tabContent[activeTab]}
      </main>
    </div>
  )
}

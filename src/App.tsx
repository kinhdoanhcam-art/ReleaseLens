import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Check,
  ChevronRight,
  CircleAlert,
  Copy,
  ExternalLink,
  Eye,
  FileDiff,
  Fingerprint,
  GitBranch,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react'
import {
  activatePending,
  CHAIN_ID,
  CONTRACT_ADDRESS,
  ContractSnapshot,
  DEPLOY_TX,
  EXPLORER_URL,
  proposeChange,
  readSnapshot,
} from './lib/contract'

type TxState = {
  phase: 'idle' | 'signing' | 'submitted' | 'finalizing' | 'success' | 'error'
  label?: string
  hash?: string
  message?: string
}

const emptySnapshot: ContractSnapshot = {
  name: 'SemVerGuard',
  contractVersion: '1.1',
  activeVersion: '—',
  activeSpec: '',
  lastClassification: '',
  hasPending: false,
  pendingClassification: '',
  pendingSpec: '',
  maintainer: '',
  minSpecLength: 20,
  maxSpecLength: 4000,
  singleMaintainer: true,
  pendingCanBeCancelled: false,
}

function shortAddress(value: string, front = 6, back = 4) {
  if (!value || value.length <= front + back + 3) return value || '—'
  return `${value.slice(0, front)}…${value.slice(-back)}`
}

function verdictClass(value: string) {
  if (value === 'BREAKING') return 'breaking'
  if (value === 'NON_BREAKING') return 'non-breaking'
  return 'neutral'
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="icon-button"
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1400)
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

function App() {
  const [snapshot, setSnapshot] = useState(emptySnapshot)
  const [loading, setLoading] = useState(true)
  const [readError, setReadError] = useState('')
  const [account, setAccount] = useState<`0x${string}` | ''>('')
  const [proposal, setProposal] = useState('')
  const [major, setMajor] = useState('1')
  const [minor, setMinor] = useState('1')
  const [tx, setTx] = useState<TxState>({ phase: 'idle' })

  const refresh = useCallback(async () => {
    setLoading(true)
    setReadError('')
    try {
      const next = await readSnapshot()
      setSnapshot(next)
      const [currentMajor, currentMinor] = next.activeVersion.split('.').map(Number)
      if (next.pendingClassification === 'BREAKING') {
        setMajor(String((currentMajor || 0) + 1))
        setMinor('0')
      } else if (next.pendingClassification === 'NON_BREAKING') {
        setMajor(String(currentMajor || 1))
        setMinor(String((currentMinor || 0) + 1))
      }
    } catch (error) {
      setReadError(error instanceof Error ? error.message : 'Unable to read finalized contract state')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!window.ethereum) return
    void window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
      const first = Array.isArray(accounts) ? accounts[0] : undefined
      if (typeof first === 'string') setAccount(first as `0x${string}`)
    })
  }, [])

  const connect = async () => {
    if (!window.ethereum) {
      setTx({ phase: 'error', message: 'No browser wallet found. Install MetaMask or another EIP-1193 wallet.' })
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const first = Array.isArray(accounts) ? accounts[0] : undefined
      if (typeof first !== 'string') throw new Error('Wallet returned no account')
      setAccount(first as `0x${string}`)
    } catch (error) {
      setTx({ phase: 'error', message: error instanceof Error ? error.message : 'Wallet connection rejected' })
    }
  }

  const isMaintainer = useMemo(
    () => Boolean(account && snapshot.maintainer && account.toLowerCase() === snapshot.maintainer.toLowerCase()),
    [account, snapshot.maintainer],
  )

  const submitProposal = async () => {
    if (!account) return void connect()
    setTx({ phase: 'signing', label: 'Proposal', message: 'Estimate fees, then confirm once in your wallet.' })
    try {
      await proposeChange(account, proposal.trim(), (hash) => {
        setTx({ phase: 'finalizing', label: 'Proposal', hash, message: 'Submitted. Waiting for finalization and execution result.' })
      })
      setTx((current) => ({ ...current, phase: 'success', message: 'Finalized with successful contract execution.' }))
      setProposal('')
      await refresh()
    } catch (error) {
      setTx((current) => ({
        ...current,
        phase: 'error',
        message: error instanceof Error ? error.message : 'Proposal failed',
      }))
    }
  }

  const submitActivation = async () => {
    if (!account) return void connect()
    setTx({ phase: 'signing', label: 'Activation', message: 'Estimate fees, then confirm once in your wallet.' })
    try {
      await activatePending(account, Number(major), Number(minor), (hash) => {
        setTx({ phase: 'finalizing', label: 'Activation', hash, message: 'Submitted. Waiting for finalization and execution result.' })
      })
      setTx((current) => ({ ...current, phase: 'success', message: 'Finalized with successful contract execution.' }))
      await refresh()
    } catch (error) {
      setTx((current) => ({
        ...current,
        phase: 'error',
        message: error instanceof Error ? error.message : 'Activation failed',
      }))
    }
  }

  const proposalValid = proposal.trim().length >= snapshot.minSpecLength && proposal.trim().length <= snapshot.maxSpecLength

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="ReleaseLens home">
          <span className="brand-mark"><ScanSearch size={21} /></span>
          <span>
            <strong>ReleaseLens</strong>
            <small>SEMANTIC RELEASE CONTROL</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {[
            ['01', 'Overview', '#overview'],
            ['02', 'Compare', '#compare'],
            ['03', 'Pending', '#pending'],
            ['04', 'Activate', '#activate'],
            ['05', 'Proof', '#proof'],
          ].map(([index, label, href], i) => (
            <a key={label} className={i === 0 ? 'active' : ''} href={href}>
              <span>{index}</span>{label}
            </a>
          ))}
        </nav>

        <div className="wallet-zone">
          {account && <span className="account-chip"><i />{shortAddress(account)}</span>}
          <button className="connect-button" onClick={connect}>
            <Wallet size={17} /> {account ? 'Connected' : 'Connect wallet'}
          </button>
        </div>
      </header>

      <div className="network-strip">
        <div><i /> STUDIONET / {CHAIN_ID}</div>
        <div>CONTRACT V{snapshot.contractVersion}</div>
        <div className="strip-right">FINALIZED READS · SINGLE MAINTAINER · NO CANCELLATION</div>
      </div>

      <main>
        <section className="hero section" id="overview">
          <div className="hero-copy">
            <p className="eyebrow">GENLAYER / SEMANTIC VERSION GATE</p>
            <h1>Know what breaks.<br /><em>Version what changes.</em></h1>
            <p className="hero-text">
              Compare behavioral specifications with AI-validator consensus, bind the verdict to the exact proposal,
              and enforce the only version transition that fits.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#compare">Compare a change <ArrowRight size={17} /></a>
              <a className="button secondary" href="#proof">Inspect proof <Eye size={17} /></a>
            </div>
          </div>

          <div className="lens-map" aria-label="Release decision flow">
            <span className="map-label">COMPATIBILITY MAP / HASH-BOUND</span>
            <div className="map-line horizontal" />
            <div className="map-line vertical" />
            <div className="map-card active-card">
              <small>01 / ACTIVE</small>
              <strong>v{snapshot.activeVersion}</strong>
              <span>FINAL SPEC</span>
            </div>
            <div className="lens-core">
              <ScanSearch size={28} />
              <strong>RELEASE<br />LENS</strong>
              <small>SEMANTIC CHECK</small>
            </div>
            <div className={`map-card pending-card ${snapshot.hasPending ? 'lit' : ''}`}>
              <small>02 / PROPOSAL</small>
              <strong>{snapshot.hasPending ? 'Pending' : 'Open'}</strong>
              <span>{snapshot.pendingClassification || 'AWAITING SPEC'}</span>
            </div>
            <div className={`verdict-node ${verdictClass(snapshot.pendingClassification || snapshot.lastClassification)}`}>
              <ShieldCheck size={15} /> {snapshot.pendingClassification || snapshot.lastClassification || 'NO VERDICT'}
            </div>
          </div>
        </section>

        <section className="metrics section" aria-label="Contract metrics">
          <div><small>ACTIVE VERSION</small><strong>{loading ? '···' : `v${snapshot.activeVersion}`}</strong><span>finalized release</span></div>
          <div><small>PENDING</small><strong>{loading ? '···' : snapshot.hasPending ? 'YES' : 'NO'}</strong><span>proposal lock</span></div>
          <div><small>LAST VERDICT</small><strong className={verdictClass(snapshot.lastClassification)}>{snapshot.lastClassification || '—'}</strong><span>semantic consensus</span></div>
          <div><small>SOURCE</small><strong>VERIFIED</strong><span>{shortAddress(CONTRACT_ADDRESS, 8, 6)}</span></div>
        </section>

        {readError && (
          <div className="read-alert section"><CircleAlert size={17} /><span>{readError}</span><button onClick={refresh}>Retry read</button></div>
        )}

        <section className="workspace section" id="compare">
          <div className="section-heading">
            <div><p className="eyebrow">01 / COMPARE</p><h2>Propose the next behavior.</h2></div>
            <p>The model sees behavior, never version numbers. One pending proposal locks the lane until valid activation.</p>
          </div>

          <div className="compare-grid">
            <article className="spec-panel readonly">
              <div className="panel-head"><span><Fingerprint size={16} /> Active specification</span><b>v{snapshot.activeVersion}</b></div>
              <div className="spec-copy">{snapshot.activeSpec || (loading ? 'Reading finalized state…' : 'No active specification returned.')}</div>
              <footer><span>FINALIZED</span><span>{snapshot.activeSpec.length} CHARS</span></footer>
            </article>

            <article className="spec-panel editor">
              <div className="panel-head"><span><FileDiff size={16} /> Proposed specification</span><b>DRAFT</b></div>
              <textarea
                value={proposal}
                onChange={(event) => setProposal(event.target.value)}
                placeholder="Describe the complete proposed behavior. Existing guarantees, accepted inputs and error behavior should be explicit."
                maxLength={snapshot.maxSpecLength}
                disabled={snapshot.hasPending || tx.phase === 'signing' || tx.phase === 'finalizing'}
              />
              <footer>
                <span className={proposal.length > 0 && !proposalValid ? 'invalid' : ''}>{proposal.trim().length} / {snapshot.maxSpecLength}</span>
                <button
                  className="inline-action"
                  disabled={!proposalValid || snapshot.hasPending || !isMaintainer || tx.phase === 'signing' || tx.phase === 'finalizing'}
                  onClick={submitProposal}
                >
                  {tx.phase === 'signing' && tx.label === 'Proposal' ? <LoaderCircle className="spin" size={15} /> : <Sparkles size={15} />}
                  Propose change
                </button>
              </footer>
            </article>
          </div>

          {!account && <p className="permission-note"><LockKeyhole size={14} /> Connect the immutable maintainer wallet to submit changes.</p>}
          {account && !isMaintainer && <p className="permission-note warning"><CircleAlert size={14} /> Connected wallet is read-only; only {shortAddress(snapshot.maintainer)} may write.</p>}
        </section>

        <section className="pending-section section" id="pending">
          <div className="section-heading compact">
            <div><p className="eyebrow">02 / PENDING</p><h2>One verdict. One route.</h2></div>
            <button className="refresh-button" onClick={refresh} disabled={loading}><RefreshCw className={loading ? 'spin' : ''} size={15} /> Refresh finalized state</button>
          </div>

          <div className="decision-grid">
            <article className={`decision-card ${snapshot.hasPending ? 'selected' : ''}`}>
              <small>HASH-BOUND PROPOSAL</small>
              <div className="decision-title"><GitBranch size={20} /><strong>{snapshot.hasPending ? 'Pending is locked' : 'Lane is open'}</strong></div>
              <p>{snapshot.pendingSpec || 'No pending proposal. Submit a complete behavioral specification to begin consensus.'}</p>
            </article>
            <article className={`decision-card verdict ${verdictClass(snapshot.pendingClassification)}`}>
              <small>CONSENSUS CLASSIFICATION</small>
              <strong>{snapshot.pendingClassification || 'AWAITING PROPOSAL'}</strong>
              <p>{snapshot.pendingClassification === 'BREAKING'
                ? 'Major must increase and the new minor must start at zero.'
                : snapshot.pendingClassification === 'NON_BREAKING'
                  ? 'Major must stay fixed and minor must strictly increase.'
                  : 'Validators will classify compatibility before a version can be activated.'}</p>
            </article>
            <article className="decision-card rule-card">
              <small>ANTI-GRINDING RULE</small>
              <div className="decision-title"><LockKeyhole size={20} /><strong>No cancellation</strong></div>
              <p>A classified proposal cannot be withdrawn or replaced. The valid version route is the only exit.</p>
            </article>
          </div>
        </section>

        <section className="activation section" id="activate">
          <div className="activate-copy">
            <p className="eyebrow">03 / ACTIVATE</p>
            <h2>Make the verdict<br />deterministic.</h2>
            <p>ReleaseLens does not ask the model for a version. The contract applies fixed SemVer constraints after consensus.</p>
            <ul>
              <li><span>BREAKING</span> higher major · minor 0</li>
              <li><span>NON_BREAKING</span> same major · higher minor</li>
            </ul>
          </div>

          <div className="version-console">
            <div className="console-head"><span>VERSION ROUTER</span><span>{snapshot.pendingClassification || 'INACTIVE'}</span></div>
            <div className="version-route">
              <div><small>CURRENT</small><strong>v{snapshot.activeVersion}</strong></div>
              <ChevronRight size={22} />
              <div className="version-inputs">
                <label>MAJOR<input type="number" min="0" value={major} onChange={(e) => setMajor(e.target.value)} /></label>
                <span>.</span>
                <label>MINOR<input type="number" min="0" value={minor} onChange={(e) => setMinor(e.target.value)} /></label>
              </div>
            </div>
            <button
              className="activate-button"
              disabled={!snapshot.hasPending || !isMaintainer || tx.phase === 'signing' || tx.phase === 'finalizing'}
              onClick={submitActivation}
            >
              {tx.phase === 'signing' && tx.label === 'Activation' ? <LoaderCircle className="spin" size={17} /> : <ShieldCheck size={17} />}
              Activate pending release
            </button>
            <p><CircleAlert size={13} /> Invalid version pairs revert and leave the pending proposal unchanged.</p>
          </div>
        </section>

        <section className="proof section" id="proof">
          <div className="section-heading">
            <div><p className="eyebrow">04 / PROOF</p><h2>Every claim has an address.</h2></div>
            <p>Public Studionet deployment. Reads use the latest finalized snapshot.</p>
          </div>
          <div className="proof-grid">
            <div><small>CONTRACT</small><strong>{CONTRACT_ADDRESS}</strong><CopyButton value={CONTRACT_ADDRESS} label="contract address" /></div>
            <div><small>DEPLOY TX</small><strong>{DEPLOY_TX}</strong><CopyButton value={DEPLOY_TX} label="deploy transaction" /></div>
            <div><small>MAINTAINER</small><strong>{snapshot.maintainer || 'Reading…'}</strong><CopyButton value={snapshot.maintainer} label="maintainer" /></div>
            <a href={EXPLORER_URL} target="_blank" rel="noreferrer"><ExternalLink size={18} /><span>Open Studio Explorer</span></a>
          </div>
        </section>
      </main>

      {tx.phase !== 'idle' && (
        <aside className={`tx-toast ${tx.phase}`}>
          <div className="tx-icon">
            {tx.phase === 'success' ? <Check size={18} /> : tx.phase === 'error' ? <CircleAlert size={18} /> : <LoaderCircle className="spin" size={18} />}
          </div>
          <div><small>{tx.label || 'TRANSACTION'} / {tx.phase.toUpperCase()}</small><p>{tx.message}</p>{tx.hash && <a href={`https://explorer-studio.genlayer.com/transactions/${tx.hash}`} target="_blank" rel="noreferrer">{shortAddress(tx.hash, 12, 8)} <ExternalLink size={12} /></a>}</div>
          <button onClick={() => setTx({ phase: 'idle' })}>×</button>
        </aside>
      )}

      <footer className="site-footer">
        <span><Activity size={14} /> ReleaseLens</span>
        <span>SEMANTIC CONSENSUS · HASH BINDING · DETERMINISTIC SEMVER</span>
      </footer>
    </div>
  )
}

export default App

import { createClient } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'
import { ExecutionResult, TransactionHash, TransactionHashVariant, TransactionStatus } from 'genlayer-js/types'

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0xd18756fa5bD6003c2a960DF1106a6599F0011064') as `0x${string}`

export const DEPLOY_TX = (import.meta.env.VITE_DEPLOY_TX ||
  '0x9661d03e732fbe10c27fb24c100a313af479a98f091e03efb99c5e14a8f89873') as `0x${string}`

export const EXPLORER_URL = `https://explorer-studio.genlayer.com/address/${CONTRACT_ADDRESS}`
export const CHAIN_ID = 61999

export type ContractSnapshot = {
  name: string
  contractVersion: string
  activeVersion: string
  activeSpec: string
  lastClassification: string
  hasPending: boolean
  pendingClassification: string
  pendingSpec: string
  maintainer: string
  minSpecLength: number
  maxSpecLength: number
  singleMaintainer: boolean
  pendingCanBeCancelled: boolean
}

const readClient = createClient({ chain: studionet })

function textValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'calldata' in value) {
    return String((value as { calldata: unknown }).calldata)
  }
  return String(value ?? '')
}

function objectValue(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if ('calldata' in value) return objectValue((value as { calldata: unknown }).calldata)
    return value as Record<string, unknown>
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  return {}
}

function splitSummary(summary: string) {
  const pendingMarker = '; pending_classification='
  const specMarker = '; active_spec='
  const specAt = summary.indexOf(specMarker)
  const head = specAt >= 0 ? summary.slice(0, specAt) : summary
  const activeSpec = specAt >= 0 ? summary.slice(specAt + specMarker.length) : ''
  const fields = Object.fromEntries(
    head.split('; ').map((part) => {
      const at = part.indexOf('=')
      return at >= 0 ? [part.slice(0, at), part.slice(at + 1)] : [part, '']
    }),
  )
  if (!summary.includes(pendingMarker)) fields.pending_classification = ''
  return { fields, activeSpec }
}

function splitPending(pending: string) {
  const marker = '; pending_spec='
  const specAt = pending.indexOf(marker)
  const head = specAt >= 0 ? pending.slice(0, specAt) : pending
  const pendingSpec = specAt >= 0 ? pending.slice(specAt + marker.length) : ''
  const fields = Object.fromEntries(
    head.split('; ').map((part) => {
      const at = part.indexOf('=')
      return at >= 0 ? [part.slice(0, at), part.slice(at + 1)] : [part, '']
    }),
  )
  return { fields, pendingSpec }
}

export async function readSnapshot(): Promise<ContractSnapshot> {
  const call = (functionName: string) =>
    readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName,
      args: [],
      transactionHashVariant: TransactionHashVariant.LATEST_FINAL,
    })

  const [configRaw, summaryRaw, pendingRaw] = await Promise.all([
    call('get_config'),
    call('get_summary'),
    call('get_pending'),
  ])

  const config = objectValue(configRaw)
  const summary = splitSummary(textValue(summaryRaw))
  const pending = splitPending(textValue(pendingRaw))

  return {
    name: String(config.name || 'SemVerGuard'),
    contractVersion: String(config.version || '1.1'),
    activeVersion: summary.fields.active_version || '—',
    activeSpec: summary.activeSpec,
    lastClassification: summary.fields.last_classification || '',
    hasPending: /^(true|yes)$/i.test(pending.fields.has_pending || summary.fields.has_pending || ''),
    pendingClassification: pending.fields.classification || summary.fields.pending_classification || '',
    pendingSpec: pending.pendingSpec,
    maintainer: String(config.maintainer || ''),
    minSpecLength: Number(config.min_spec_length || 20),
    maxSpecLength: Number(config.max_spec_length || 4000),
    singleMaintainer: config.single_maintainer !== false,
    pendingCanBeCancelled: config.pending_can_be_cancelled === true,
  }
}

async function walletClient(account: `0x${string}`) {
  if (!window.ethereum) throw new Error('No EIP-1193 wallet detected')
  const client = createClient({
    chain: studionet,
    account,
    provider: window.ethereum as never,
  })
  await client.connect('studionet')
  return client
}

async function writeAndWait(
  account: `0x${string}`,
  functionName: string,
  args: unknown[],
  onSubmitted: (hash: string) => void,
) {
  const client = await walletClient(account)
  const write = {
    address: CONTRACT_ADDRESS,
    functionName,
    args: args as never[],
    value: 0n,
  }
  const hash = await client.writeContract(write)
  onSubmitted(String(hash))
  const transaction = await client.waitForTransactionReceipt({
    hash: hash as TransactionHash,
    status: TransactionStatus.FINALIZED,
    interval: 5_000,
    retries: 360,
  })
  const status = String(transaction.statusName || transaction.status || 'UNKNOWN')
  const result = String(transaction.txExecutionResultName || transaction.txExecutionResult || 'UNKNOWN_EXECUTION')
  const statusOk = status === TransactionStatus.ACCEPTED || status === TransactionStatus.FINALIZED || status === '5' || status === '7'
  const executionOk = result === ExecutionResult.FINISHED_WITH_RETURN || result === '1'
  if (!statusOk || !executionOk) {
    throw new Error(`Transaction finalized without success: ${status} / ${result}`)
  }
  return String(hash)
}

export function proposeChange(
  account: `0x${string}`,
  spec: string,
  onSubmitted: (hash: string) => void,
) {
  return writeAndWait(account, 'propose_change', [spec], onSubmitted)
}

export function activatePending(
  account: `0x${string}`,
  major: number,
  minor: number,
  onSubmitted: (hash: string) => void,
) {
  return writeAndWait(account, 'activate_pending', [major, minor], onSubmitted)
}

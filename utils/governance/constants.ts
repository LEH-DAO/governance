import { PublicKey } from '@solana/web3.js'

export const MANGO_REALM_PK = new PublicKey(
  'GpBGQrHjNpjJq7R28gN6ZTgNvMug3Wrf2RryXsQmNqob',
)
export const MANGO_GOVERNANCE_PROGRAM = new PublicKey(
  'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw',
)

export const VOTER_INFO_EVENT_NAME = 'VoterInfo'
export const DEPOSIT_EVENT_NAME = 'DepositEntryInfo'
// The wallet can be any existing account for the simulation
// Note: when running a local validator ensure the account is copied from devnet: --clone ENmcpFCpxN1CqyUjuog9yyUVfdXBKF3LVCwLr7grJZpk -ud
export const SIMULATION_WALLET = 'ENmcpFCpxN1CqyUjuog9yyUVfdXBKF3LVCwLr7grJZpk'

export const MANGO_MINT = new PublicKey(
  '7obg932wg2A1oTZhrPzR4DSdhKbjXzKSfHTBo2Hu5EbP',
)

export const MANGO_DAO_WALLET_GOVERNANCE = new PublicKey(
  'D2JFLxZ8Qzhc224NYJVssHgtj9GcxuW2EQiBc7tHjsTq',
)

export const MANGO_DAO_FAST_LISTING_GOVERNANCE = new PublicKey(
  '7D6tGmaMyC8i73Q8X2Fec2S1Zb5rkyai6pctdMqHpHWT',
)

export const MANGO_DAO_FAST_LISTING_WALLET = new PublicKey(
  'Fmt4596j4uBvYutwQ2ZBw7RGw9EngR8yNijdqemnpiaB',
)

export const MANGO_DAO_WALLET = new PublicKey(
  '3vUvjxr3izKE8eepizu5JDHrqfedQoF3rnWrwddASiNi',
)

export const MANGO_MINT_DECIMALS = 6

export const MAINNET_PYTH_PROGRAM = new PublicKey(
  'FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH',
)
export const DEVNET_PYTH_PROGRAM = new PublicKey(
  'gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s',
)

export const GOVERNANCE_DELEGATE_KEY = '-selected-delegate'

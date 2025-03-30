export interface ResponseType {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
  txs: Tx[];
}

export interface Tx {
  block_hash: string;
  block_height: number;
  block_index: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  vsize: number;
  preference: string;
  relayed_by: string;
  confirmed: Date;
  received: Date;
  ver: number;
  lock_time: number;
  double_spend: boolean;
  vin_sz: number;
  vout_sz: number;
  confirmations: number;
  confidence: number;
  inputs: Input[];
  outputs: Output[];
  next_inputs?: string;
}

export interface Input {
  prev_hash: string;
  output_index: number;
  script?: Script;
  output_value: number;
  sequence: number;
  addresses: string[];
  script_type: ScriptType;
  age: number;
  witness?: string[];
}

export enum Script {
  The1600142Ed80707202396F614F6D42F2D841De79F428Cfc = "1600142ed80707202396f614f6d42f2d841de79f428cfc",
  The160014788C212763A9Dcbbf4E985C6A6546A57C27943A3 = "160014788c212763a9dcbbf4e985c6a6546a57c27943a3",
  The1600149F7150B39Bf7E68E2042F9Fa480429A9F789826B = "1600149f7150b39bf7e68e2042f9fa480429a9f789826b",
}

export enum ScriptType {
  PayToScriptHash = "pay-to-script-hash",
  PayToWitnessPubkeyHash = "pay-to-witness-pubkey-hash",
}

export interface Output {
  value: number;
  script: string;
  spent_by: string;
  addresses: string[];
  script_type: ScriptType;
}

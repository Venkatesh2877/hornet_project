import { Input, Output, ResponseType } from "./_type";

export const handleSearch = async (value: string) => {
  const url = `https://api.blockcypher.com/v1/btc/main/addrs/${value}/full`;
  //   const url = `https://blockchain.info/rawaddr/${value}`;

  let Inflow: Input[] = [];
  let Outflow: Output[] = [];

  try {
    const response = await fetch(url);
    const data: ResponseType = await response.json();

    data.txs.forEach((tx) => {
      tx.inputs.forEach((input) => {
        Inflow.push(input);
      });
      tx.outputs.forEach((output) => {
        Outflow.push(output);
      });
    });

    return { Inflow, Outflow };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { Inflow, Outflow };
  }
};

export const handleBundle = (Inflow: Input[], Outflow: Output[]) => {
  let bundleedInflow: Record<string, number[]> = {};
  let bundleedOutflow: Record<string, number[]> = {};
  const bundleInput = (input: Input[]) => {
    input.map((each) => {
      const walletAddress = each.addresses[0];
      const value = each.output_value;

      bundleedInflow = {
        ...bundleedInflow,
        [walletAddress]: [...(bundleedInflow[walletAddress] || []), value],
      };
    });
  };
  const bundleOutput = (output: Output[]) => {
    output.map((each) => {
      const walletAddress = each.addresses[0];
      const value = each.value;

      bundleedOutflow = {
        ...bundleedOutflow,
        [walletAddress]: [...(bundleedOutflow[walletAddress] || []), value],
      };
    });
  };

  bundleInput(Inflow);
  bundleOutput(Outflow);

  return { bundleedInflow, bundleedOutflow };
};

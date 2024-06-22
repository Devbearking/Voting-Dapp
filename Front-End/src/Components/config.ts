import { TransportConfig, EIP1193RequestFn } from "viem";
import { http, createConfig, Connector } from "wagmi";
import { Chain, lineaSepolia } from "wagmi/chains";
import { StoreApi } from "zustand/vanilla";
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [lineaSepolia],
  connectors: [injected()],
  transports: {
    [lineaSepolia.id]: http(),
    11155111: function (params: { chain?: Chain | undefined; pollingInterval?: number | undefined; retryCount?: number | undefined; timeout?: number | undefined; } & { connectors?: StoreApi<Connector[]> | undefined; }): { config: TransportConfig<string, EIP1193RequestFn>; request: EIP1193RequestFn; value?: Record<string, any> | undefined; } {
      throw new Error("Function not implemented.");
    }
  },
});

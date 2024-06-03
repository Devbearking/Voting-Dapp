import { http, createConfig } from "wagmi";
import { linea } from "wagmi/chains";

export const config = createConfig({
  chains: [linea],
  transports: {
    [linea.id]: http(),
  },
});

// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// // import { useWallet } from "@solana/wallet-adapter-react";
// // import { LAMPORTS_PER_SOL } from "@solana/web3.js";
// import { createContext, useContext, useEffect, useState } from "react";
// import * as anchor from "@project-serum/anchor";
// import { NEXT_PUBLIC_SOLANA_NETWORK, RPC_URL } from '../constant/env';
// const BalanceContext = createContext(null);

// // const connection = new anchor.web3.Connection(NEXT_PUBLIC_SOLANA_NETWORK == "devnet" ? "https://metaplex.devnet.rpcpool.com" : "https://metaplex.mainnet.rpcpool.com");
// const connection = new anchor.web3.Connection(RPC_URL);

// export default function useWalletBalance() {
// 	const [balance, setBalance]: any = useContext(BalanceContext);
// 	return [balance, setBalance]
// }

// export const WalletBalanceProvider: React.FC<{}> = ({ children }) => {
// 	const wallet = useWallet();
// 	const [balance, setBalance] = useState(0);

// 	useEffect(() => {
// 		(async () => {
// 			try {
// 				if (wallet?.publicKey) {
// 					const balance = await connection.getBalance(wallet.publicKey);
// 					setBalance(balance / LAMPORTS_PER_SOL);
// 				}
// 			}
// 			catch (err) {
// 			}
// 		})();
// 	}, [wallet, connection]);

// 	return <BalanceContext.Provider
// 		value={[balance, setBalance] as any}>
// 		{children}
// 	</BalanceContext.Provider>
// }
// import axios from "axios";
// // import { sendTransactions } from "./utility";
// import { COLLECTION_NAME, COLLECTION_SYMBOL, CREATOR } from "../constant/contract";
// import { NEXT_PUBLIC_SOLANA_NETWORK, RPC_URL } from '../constant/env';
// // import * as anchor from "@project-serum/anchor";
// // import {
// //   resolveToWalletAddress,
// //   getParsedNftAccountsByOwner,
// // } from "@nfteyez/sol-rayz";
// // import {
// //   MintLayout,
// //   TOKEN_PROGRAM_ID,
// //   Token,
// // } from "@solana/spl-token";
// import { programs } from '@metaplex/js';
// // import { LAMPORTS_PER_SOL, SystemProgram, PublicKey } from "@solana/web3.js";
// const { metadata: { Metadata } } = programs


// // const connection = new anchor.web3.Connection(NEXT_PUBLIC_SOLANA_NETWORK == "devnet" ? "https://metaplex.devnet.rpcpool.com" : "https://metaplex.mainnet.rpcpool.com");
// const connection = new anchor.web3.Connection(RPC_URL);

// export const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
//   "cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ"
// );

// const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey(
//   "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
// );

// const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
//   "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
// );

// const ARWEAVE_PUBKEY = new anchor.web3.PublicKey("XCVoVzSUv6nM7zytC1CPk9b2BxsQwXC1sW8wxQRhHBC");
// const RENT_STORAGE_PRICE = 0.015;

// export interface CandyMachine {
//   id: anchor.web3.PublicKey,
//   connection: anchor.web3.Connection;
//   program: anchor.Program;
// }

// interface CandyMachineState {
//   candyMachine: CandyMachine;
//   itemsAvailable: number;
//   itemsRedeemed: number;
//   itemsRemaining: number;
//   goLiveDate: Date,
// }

// export const awaitTransactionSignatureConfirmation = async (
//   txid: anchor.web3.TransactionSignature,
//   timeout: number,
//   connection: anchor.web3.Connection,
//   commitment: anchor.web3.Commitment = "recent",
//   queryStatus = false
// ): Promise<anchor.web3.SignatureStatus | null | void> => {
//   let done = false;
//   let status: anchor.web3.SignatureStatus | null | void = {
//     slot: 0,
//     confirmations: 0,
//     err: null,
//   };
//   let subId = 0;
//   status = await new Promise(async (resolve, reject) => {
//     setTimeout(() => {
//       if (done) {
//         return;
//       }
//       done = true;
//       reject({ timeout: true });
//     }, timeout);
//     try {
//       subId = connection.onSignature(
//         txid,
//         (result: any, context: any) => {
//           done = true;
//           status = {
//             err: result.err,
//             slot: context.slot,
//             confirmations: 0,
//           };
//           if (result.err) {
//             reject(status);
//           } else {
//             resolve(status);
//           }
//         },
//         commitment
//       );
//     } catch (e) {
//       done = true;
//       console.error("WS error in setup", txid, e);
//     }
//     while (!done && queryStatus) {
//       // eslint-disable-next-line no-loop-func
//       (async () => {
//         try {
//           const signatureStatuses = await connection.getSignatureStatuses([
//             txid,
//           ]);
//           status = signatureStatuses && signatureStatuses.value[0];
//           if (!done) {
//             if (!status) {
//             } else if (status.err) {
//               done = true;
//               reject(status.err);
//             } else if (!status.confirmations) {
//             } else {
//               done = true;
//               resolve(status);
//             }
//           }
//         } catch (e) {
//           if (!done) {
//           }
//         }
//       })();
//       // await sleep(2000);
//     }
//   });

//   //@ts-ignore
//   if (connection._signatureSubscriptions[subId]) {
//     connection.removeSignatureListener(subId);
//   }
//   done = true;
//   return status;
// }

// const createAssociatedTokenAccountInstruction = (
//   associatedTokenAddress: anchor.web3.PublicKey,
//   payer: anchor.web3.PublicKey,
//   walletAddress: anchor.web3.PublicKey,
//   splTokenMintAddress: anchor.web3.PublicKey
// ) => {
//   const keys = [
//     { pubkey: payer, isSigner: true, isWritable: true },
//     { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
//     { pubkey: walletAddress, isSigner: false, isWritable: false },
//     { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
//     {
//       pubkey: anchor.web3.SystemProgram.programId,
//       isSigner: false,
//       isWritable: false,
//     },
//     // { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
//     {
//       pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
//       isSigner: false,
//       isWritable: false,
//     },
//   ];
//   return new anchor.web3.TransactionInstruction({
//     keys,
//     programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
//     data: Buffer.from([]),
//   });
// }

// export const getCandyMachineState = async (
//   anchorWallet: anchor.Wallet,
//   candyMachineId: anchor.web3.PublicKey,
//   connection: anchor.web3.Connection,
// ): Promise<CandyMachineState> => {
//   const provider = new anchor.Provider(connection, anchorWallet, {
//     preflightCommitment: "recent",
//   });

//   const idl = await anchor.Program.fetchIdl(
//     CANDY_MACHINE_PROGRAM,
//     provider
//   );

//   const program = new anchor.Program(idl!, CANDY_MACHINE_PROGRAM, provider);
//   const candyMachine = {
//     id: candyMachineId,
//     connection,
//     program,
//   }
//   const state: any = await program.account.candyMachine.fetch(candyMachineId);
//   const itemsAvailable = state.data.itemsAvailable.toNumber();
//   const itemsRedeemed = state.itemsRedeemed.toNumber();
//   const itemsRemaining = itemsAvailable - itemsRedeemed;

//   let goLiveDate = state.data.goLiveDate.toNumber();
//   goLiveDate = new Date(goLiveDate * 1000);

//   return {
//     candyMachine,
//     itemsAvailable,
//     itemsRedeemed,
//     itemsRemaining,
//     goLiveDate,
//   };
// }

// const getMasterEdition = async (
//   mint: anchor.web3.PublicKey
// ): Promise<anchor.web3.PublicKey> => {
//   return (
//     await anchor.web3.PublicKey.findProgramAddress(
//       [
//         Buffer.from("metadata"),
//         TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//         mint.toBuffer(),
//         Buffer.from("edition"),
//       ],
//       TOKEN_METADATA_PROGRAM_ID
//     )
//   )[0];
// };

// const getMetadata = async (
//   mint: anchor.web3.PublicKey
// ): Promise<anchor.web3.PublicKey> => {
//   return (
//     await anchor.web3.PublicKey.findProgramAddress(
//       [
//         Buffer.from("metadata"),
//         TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//         mint.toBuffer(),
//       ],
//       TOKEN_METADATA_PROGRAM_ID
//     )
//   )[0];
// };

// // const getTokenWallet = async (
// //   wallet: anchor.web3.PublicKey,
// //   mint: anchor.web3.PublicKey
// // ) => {
// //   return (
// //     await anchor.web3.PublicKey.findProgramAddress(
// //       [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
// //       SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
// //     )
// //   )[0];
// // };

// // export async function getNftsForOwner(
// //   conn: any,
// //   owner: PublicKey
// // ) {
// //   const allTokens: any = []
// //   // const tokenAccounts = await conn.getParsedTokenAccountsByOwner(owner, {
// //   //   programId: TOKEN_PROGRAM_ID
// //   // });

// //   for (let index = 0; index < tokenAccounts.value.length; index++) {
// //     try {
// //       const tokenAccount = tokenAccounts.value[index];
// //       const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;

// //       if (tokenAmount.amount == "1" && tokenAmount.decimals == "0") {
// //         let nftMint = new PublicKey(tokenAccount.account.data.parsed.info.mint)
// //         let [pda] = await anchor.web3.PublicKey.findProgramAddress([
// //           Buffer.from("metadata"),
// //           TOKEN_METADATA_PROGRAM_ID.toBuffer(),
// //           nftMint.toBuffer(),
// //         ], TOKEN_METADATA_PROGRAM_ID);
// //         const accountInfo: any = await conn.getParsedAccountInfo(pda);
// //         let metadata: any = new Metadata(owner.toString(), accountInfo.value);
// //         const { data }: any = await axios.get(metadata.data.data.uri)
// //         if (metadata.data.data.symbol == COLLECTION_NAME) {
// //           const entireData = { ...data, id: Number(data.name.replace(/^\D+/g, '').split(' - ')[0]) }
// //           allTokens.push({ account: tokenAccount.pubkey, address: nftMint, ...entireData })
// //         }
// //       }
// //       allTokens.sort(function (a: any, b: any) {
// //         if (a.name < b.name) { return -1; }
// //         if (a.name > b.name) { return 1; }
// //         return 0;
// //       })
// //     } catch (err) {
// //       continue;
// //     }
// //   }
// //   // console.log('-------', allTokens);
// //   return allTokens
// // }

// // export const getNftMetadata = async (uri: string) => {

// //   const result =
// //     await fetch(uri)
// //       .then(res => res.json())
// //       .catch(() => {})

// //   return result;
// // }

// // export async function getNftsForOwner1(
// //   owner: PublicKey
// // ) {
// //   const allTokens: any = []
// //   try {

// //     const getAllNft = await getParsedNftAccountsByOwner({
// //       publicAddress: owner.toBase58(),
// //       connection
// //     })

// //     const getCollection = getAllNft.filter((item) => {
// //       return item?.data?.creators && item?.data?.creators[0]?.address === CREATOR
// //     })
// //     const getMetadata = await Promise.all(getCollection.map((item) => {
// //       let meta = getNftMetadata(item?.data?.uri);
// //       return meta
// //     }))
// //     const getNewCollection = getCollection.map((item, idx) => {
// //       return { ...getMetadata[idx], ...item.data, ...item, id: Number(item.data.name.replace(/^\D+/g, '').split(' - ')[0]) }
// //     })

// //     for (let i = 0; i < getNewCollection.length; i ++) {
// //       const nft =  getNewCollection[i];
// //       const tokenAccount = await getTokenWallet(owner, new anchor.web3.PublicKey(nft.mint))
// //       allTokens.push({ account: tokenAccount, address: new PublicKey(nft.mint), ...nft })
// //     }


// //   } catch (error: any) {
// //     console.error('NFT from wallet', error.message);
// //   }
// //   return allTokens
// // }

// // export const mintOneToken = async (
// //   candyMachine: CandyMachine,
// //   config: anchor.web3.PublicKey,
// //   payer: anchor.web3.PublicKey,
// //   treasury: anchor.web3.PublicKey,
// // ): Promise<string> => {
// //   const mint = anchor.web3.Keypair.generate();
// //   const token = await getTokenWallet(payer, mint.publicKey);
// //   const { connection, program } = candyMachine;
// //   const metadata = await getMetadata(mint.publicKey);
// //   const masterEdition = await getMasterEdition(mint.publicKey);
// //   const rent = await connection.getMinimumBalanceForRentExemption(
// //     MintLayout.span
// //   );

// //   return await program.rpc.mintNft({
// //     accounts: {
// //       config,
// //       candyMachine: candyMachine.id,
// //       payer: payer,
// //       wallet: treasury,
// //       mint: mint.publicKey,
// //       metadata,
// //       masterEdition,
// //       mintAuthority: payer,
// //       updateAuthority: payer,
// //       tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
// //       tokenProgram: TOKEN_PROGRAM_ID,
// //       systemProgram: anchor.web3.SystemProgram.programId,
// //       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
// //       clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
// //     },
// //     signers: [mint],
// //     instructions: [
// //       anchor.web3.SystemProgram.createAccount({
// //         fromPubkey: payer,
// //         newAccountPubkey: mint.publicKey,
// //         space: MintLayout.span,
// //         lamports: rent,
// //         programId: TOKEN_PROGRAM_ID,
// //       }),
// //       Token.createInitMintInstruction(
// //         TOKEN_PROGRAM_ID,
// //         mint.publicKey,
// //         0,
// //         payer,
// //         payer
// //       ),
// //       createAssociatedTokenAccountInstruction(
// //         token,
// //         payer,
// //         payer,
// //         mint.publicKey
// //       ),
// //       Token.createMintToInstruction(
// //         TOKEN_PROGRAM_ID,
// //         mint.publicKey,
// //         token,
// //         payer,
// //         [],
// //         1
// //       ),
// //       SystemProgram.transfer({
// //         fromPubkey: payer,
// //         toPubkey: ARWEAVE_PUBKEY,
// //         lamports: LAMPORTS_PER_SOL * RENT_STORAGE_PRICE,
// //       }),
// //     ],
// //   });
// // }

// // export const shortenAddress = (address: string, chars = 4): string => {
// //   return `${address.slice(0, chars)}...${address.slice(-chars)}`;
// // };

// // const sleep = (ms: number): Promise<void> => {
// //   return new Promise((resolve) => setTimeout(resolve, ms));
// // }

// // export const mintMultipleToken = async (
// //   candyMachine: any,
// //   config: anchor.web3.PublicKey,
// //   payer: anchor.web3.PublicKey,
// //   treasury: anchor.web3.PublicKey,
// //   quantity: number = 2,
// // ) => {
// //   const signersMatrix = []
// //   const instructionsMatrix = []

// //   for (let index = 0; index < quantity; index++) {
// //     const mint = anchor.web3.Keypair.generate();
// //     const token = await getTokenWallet(payer, mint.publicKey);
// //     const { connection } = candyMachine;
// //     const rent = await connection.getMinimumBalanceForRentExemption(
// //       MintLayout.span
// //     );
// //     const instructions = [
// //       anchor.web3.SystemProgram.createAccount({
// //         fromPubkey: payer,
// //         newAccountPubkey: mint.publicKey,
// //         space: MintLayout.span,
// //         lamports: rent,
// //         programId: TOKEN_PROGRAM_ID,
// //       }),
// //       Token.createInitMintInstruction(
// //         TOKEN_PROGRAM_ID,
// //         mint.publicKey,
// //         0,
// //         payer,
// //         payer
// //       ),
// //       createAssociatedTokenAccountInstruction(
// //         token,
// //         payer,
// //         payer,
// //         mint.publicKey
// //       ),
// //       Token.createMintToInstruction(
// //         TOKEN_PROGRAM_ID,
// //         mint.publicKey,
// //         token,
// //         payer,
// //         [],
// //         1
// //       ),
// //       SystemProgram.transfer({
// //         fromPubkey: payer,
// //         toPubkey: ARWEAVE_PUBKEY,
// //         lamports: LAMPORTS_PER_SOL * RENT_STORAGE_PRICE,
// //       }),
// //     ];
// //     const masterEdition = await getMasterEdition(mint.publicKey);
// //     const metadata = await getMetadata(mint.publicKey);

// //     instructions.push(
// //       await candyMachine.program.instruction.mintNft({
// //         accounts: {
// //           config,
// //           candyMachine: candyMachine.id,
// //           payer: payer,
// //           wallet: treasury,
// //           mint: mint.publicKey,
// //           metadata,
// //           masterEdition,
// //           mintAuthority: payer,
// //           updateAuthority: payer,
// //           tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
// //           tokenProgram: TOKEN_PROGRAM_ID,
// //           systemProgram: anchor.web3.SystemProgram.programId,
// //           rent: anchor.web3.SYSVAR_RENT_PUBKEY,
// //           clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
// //         }
// //       }),
// //     );
// //     const signers: anchor.web3.Keypair[] = [mint];

// //     signersMatrix.push(signers)
// //     instructionsMatrix.push(instructions)
// //   }

// //   return await sendTransactions(
// //     candyMachine.program.provider.connection,
// //     candyMachine.program.provider.wallet,
// //     instructionsMatrix,
// //     signersMatrix,
// //   );
// // }
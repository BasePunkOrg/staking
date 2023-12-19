import StakingABI from "../constant/NFTStaking.json"
import TokenErc721 from "../constant/ERC721.json";

// export const Backend_URL = 'http://localhost:5000'

// export const API_URL = `${Backend_URL}/api`;

export const NFTStake = {
  address: `0xA31420F5Bc6cf8A9D4Ac7b6132b7FC2f93546fAb`,
  ABI: StakingABI,
};
//0xc8F95BfbdE822d7Be8CE2a9CeA6433711f7c6d02
export const NFTContract = {
  address : `0x89290b2FaD76bF4a6Ed9D8066f644d45530FA920`,
  ABI: TokenErc721
}



export const TOAST_TIME_OUT = 2000;
export const INTERVAL = 6 * 1000;
export const DECIMAL = 1000000000000000000;
// export const CHAINID = '0x5' //Goerli
 export const CHAINID = "0x2105"; // base
 //export const CHAINID = "0x13881"; //polygon testnet

export const WALLET_STATUS_LOCALSTORAGE = "wallet";
export const WALLET_ADRESS_LOCALSTORAGE = "wallet_address";
export const SIGN_KEY = "VERIFY WALLET";
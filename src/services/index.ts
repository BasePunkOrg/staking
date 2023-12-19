import { ethers } from "ethers";
import CONFIG from "../config";
import { toast } from "react-toastify";


export const stakeItem = async (ids:any) => {
    console.log(ids);
    if (window.ethereum) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const signer = provider.getSigner();
            const nft_contract = new ethers.Contract(CONFIG.NFTContract.address, CONFIG.NFTContract.ABI, signer);
            const staking_contract = new ethers.Contract(CONFIG.NFTStake.address, CONFIG.NFTStake.ABI, signer);

            // Loop through each token ID and approve it
            for (const id of ids) {
                console.log('Approving token ID:', id);
                const approve_tx = await nft_contract.approve(CONFIG.NFTStake.address, id);
                await approve_tx.wait();
            }

            // Now that all tokens are approved, stake them
            console.log('Staking tokens:', ids);
            const stake_tx = await staking_contract.stake(ids);
            await stake_tx.wait();

        
            return 1;
        } catch (error) {
            toast.error("An error has occurred while staking. Please try again.");
            console.error(error);
            return 0;
        }
    } else {
        toast.error("Please connect to the wallet.");
    }
}

export const unstakeItem = async (ids: any) => {
    if (window.ethereum) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const signer = provider.getSigner()
            const staking_contract = new ethers.Contract(CONFIG.NFTStake.address, CONFIG.NFTStake.ABI, signer);

            // const unstake_tx = await staking_contract.unstake(ids,{ gasLimit: 500000, gasPrice: ethers.utils.parseUnits('1', 'gwei') })
            const unstake_tx = await staking_contract.unstake(ids);
            await unstake_tx.wait()

            return 1;
        } catch (error) {
         
            toast.error("An error has occured while unstaking, Please Try Again")
            console.log(error)
            return 0;
        }
    }else {
        toast.error("Please connect to the wallet.");
    }
}

export const claim = async (ids: any) => {
    if (window.ethereum) {
        try {
           
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const signer = provider.getSigner()
            const staking_contract = new ethers.Contract(CONFIG.NFTStake.address, CONFIG.NFTStake.ABI, signer);

            // const claim_tx = await staking_contract.claim(ids, { gasLimit: 500000, gasPrice: ethers.utils.parseUnits('1', 'gwei') });
            const claim_tx = await staking_contract.claim(ids);
       
            // await claim_tx.wait()
            const receipt = await claim_tx.wait();
            console.log('Revert Reason:', receipt && receipt.events && receipt.events[0].event === 'Failure' ? receipt.events[0].args.reason : 'No revert reason');
            return 1;
        } catch (error) {
            toast.error("An error has occured while claiming, Please Try Again")
            console.log(error)
            return 0;
        }
    }
}
export const GetUserNfts = async (user: string) => {
    try {
      if (window.ethereum) {
        const options = {
            method: 'GET',
            headers: {accept: 'application/json', 'x-api-key': '2ZkwVmD1OoGVhaazrbSSqhjS7Om'}
          };
  
        const response = await fetch(`https://api.chainbase.online/v1/account/nfts?chain_id=8453&address=${user}&contract_address=0x89290b2FaD76bF4a6Ed9D8066f644d45530FA920&page=1&limit=100`, options);
       
        const datas = await response.json();
        console.log(datas);

        if(datas.data != null){
             // Extract token IDs from the response
        const tokenIds = datas.data.map((asset: any) => Number(asset.token_id));
        console.log("user NFT response", tokenIds);
        return tokenIds;
        }else {
            return [];
        }
       
      }
    } catch (error) {
      console.error(error);
      throw error; // Propagate the error
    }
  };
  
  


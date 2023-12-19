import Stake from "./Stake";
import UnStake from "./UnStake";
import Loader from "../loader/Loader";
import ProgressBar from "../loader/ProgressBar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CONNECT } from "../../actions"
import { connectWallet } from "../../utils";
import CONFIG from "../../config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import { GetUserNfts, claim, stakeItem, unstakeItem } from "../../services";
import 'react-toastify/dist/ReactToastify.css';



// Get NFT from wallet 
//change  
const Home = () => {
  interface NftInfo {
    currentSupply: number;
    maxSupply: number;
    userNftIds: number[];
    stakedNftIds: number[];
   
}

interface UserNft {
  name: string;
  id: number;
  imageUri: string;
}

  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [reward,setReward] = useState("");
  const [unStackProductIds, setUnStackProduct] = useState<number[]>([]);
  const [stakedProductIds, setStakedProduct] = useState<number[]>([]);
  const storeData: any = useSelector((status) => status);
  const [walletStatus, setWalletStatus] = useState({
    status: ``,
    address: ``,
  });
  const [info, setInfo] = useState<NftInfo>()
  const [userNfts, setUserNfts] = useState<any>()
  const [stakedNfts,setStakedNfts] = useState<any>()
  const [totalStakedNfts, setTotalStakedNfts] = useState(0);
  const [maxNftsSupply, setMaxNftsSupply] = useState(0);
  
  const nfts = [
    { id: 1, imageUrl: "https://www.basepunk.xyz/assets/images/tm8.png", name: "NFT 1" },
    { id: 2, imageUrl: "https://www.basepunk.xyz/assets/images/tm5.png", name: "NFT 2" },
    { id: 3, imageUrl: "https://www.basepunk.xyz/assets/images/tm7.png", name: "NFT 3" },
    { id: 4, imageUrl: "https://www.basepunk.xyz/assets/images/tm2.png", name: "NFT 4" },
    { id: 5, imageUrl: "https://www.basepunk.xyz/assets/images/tm4.png", name: "NFT 5" },
    { id: 6, imageUrl: "https://www.basepunk.xyz/assets/images/tm3.png", name: "NFT 6" },
  ];

  const handleConnect = async () => {
    try {
      const wallet: any = await connectWallet();
      dispatch(
        CONNECT({
          wallet: `connected`,
          address: wallet.address,
        })
      );

      localStorage.setItem(CONFIG.WALLET_STATUS_LOCALSTORAGE, "connected");
      localStorage.setItem(CONFIG.WALLET_ADRESS_LOCALSTORAGE, wallet.address);
    } catch (error) {
      console.log("error", error);
    }
  };
  
  

  const handleDisConnect = () => {
    dispatch(
      CONNECT({
        wallet: `disconnect`,
        address: ``,
      })
    );
    localStorage.setItem(CONFIG.WALLET_STATUS_LOCALSTORAGE, "disconnect");
    localStorage.setItem(CONFIG.WALLET_ADRESS_LOCALSTORAGE, "");
  };

  useEffect(() => {
    const get_walletStatus: any = localStorage.getItem(
      CONFIG.WALLET_STATUS_LOCALSTORAGE
    );
    const get_walletAddress: any = localStorage.getItem(
      CONFIG.WALLET_ADRESS_LOCALSTORAGE
    );
    setWalletStatus({
      ...walletStatus,
      status: get_walletStatus,
      address: get_walletAddress,
    });
  }, [storeData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!window.ethereum || !window.ethereum.isConnected() || !window.ethereum.selectedAddress) {
          // Wallet is not connected, return early
          console.log("Wallet not connected");
          return;
        }
  
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const staking_contract = new ethers.Contract(CONFIG.NFTStake.address, CONFIG.NFTStake.ABI, provider);
  
        const updateReward = async () => {
          try {
            const user = await provider.getSigner().getAddress();
            const res = await staking_contract.callStatic.getTotalRewardEarned(user);
            setReward(ethers.utils.formatEther(res));
            console.log("Reward updated");
          } catch (error) {
            console.error('Error updating reward:', error);
          }
        };
  
        // Fetch initial data
        updateReward();
  
        // Update the reward every second
        const intervalId = setInterval(updateReward, 1000);
  
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: any) => {
          if (accounts.length === 0) {
            // Wallet disconnected, stop the interval
            clearInterval(intervalId);
            console.log("Wallet disconnected");
          }
        });
  
        // Clean up the interval and event listener when the component is unmounted or dependencies change
        return () => {
          clearInterval(intervalId);
          window.ethereum.removeAllListeners('accountsChanged');
        };
  
      } catch (error) {
        // Handle errors here
        console.error('Error fetching reward:', error);
      }
    };
  
    // Call the async function
    fetchData();
  
  }, [storeData, window.ethereum]);
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://base-mainnet.g.alchemy.com/v2/o9t9nCPDgoErA9_nMlxHY5sTXzHpcpdl"
         
      );
        const staking_contract = new ethers.Contract(CONFIG.NFTStake.address, CONFIG.NFTStake.ABI, provider);
        const nft_contract = new ethers.Contract(CONFIG.NFTContract.address, CONFIG.NFTContract.ABI, provider);
        const maxSupply = await nft_contract.totalSupply()
        console.log("Max Supply updated")
        setMaxNftsSupply(Number(maxSupply))
        const updateNftsStaked= async () => {
          const currentSupply = await staking_contract.totalItemsStaked();
          setTotalStakedNfts(Number(currentSupply))
          console.log("Total Staked NFT updated");
        };
  
        // Fetch initial data
        updateNftsStaked();
  
        // Update the reward every second
        const intervalId = setInterval(updateNftsStaked, 1000);
  
        // Clean up the interval when the component is unmounted or dependencies change
        return () => clearInterval(intervalId);
  
      } catch (error) {
        // Handle errors here
        console.error('Error fetching data:', error);
      }
    };
  
    // Call the async function
    fetchData();
  
  }, []);
  
  
  

  useEffect(() => {
    try {
      window.ethereum.on("accountsChanged", async () => {

        const wallet: any = await connectWallet();
        localStorage.setItem(CONFIG.WALLET_STATUS_LOCALSTORAGE, "connected");
        localStorage.setItem(CONFIG.WALLET_ADRESS_LOCALSTORAGE, wallet.address);
        dispatch(
          CONNECT({
            wallet: "connected",
            address: wallet.address,
          })
        );

        setWalletStatus({
          ...walletStatus,
          status: "connected",
          address: wallet.address,
        });
        const fetchData = async () => {
          try {
            await getInfo();
            
          } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors if needed
          }
        };
    
        fetchData();
      });
    } catch { }
  }, []);

  useEffect(() => {
    
    const get_walletStatus: any = localStorage.getItem(
      CONFIG.WALLET_STATUS_LOCALSTORAGE
    );
    const get_walletAddress: any = localStorage.getItem(
      CONFIG.WALLET_ADRESS_LOCALSTORAGE
    );
    dispatch(
      CONNECT({
        wallet: get_walletStatus,
        address: get_walletAddress,
      })
    );
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getInfo();
       
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors if needed
      }
    };

    fetchData();

  }, []); 

  const getInfo = async () => {
    try{
      if (window.ethereum) {
        setShowLoader(true);
        console.log("calling getInfo");
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const nft_contract = new ethers.Contract(CONFIG.NFTContract.address, CONFIG.NFTContract.ABI, provider);
        const staking_contract = new ethers.Contract(CONFIG.NFTStake.address, CONFIG.NFTStake.ABI, provider);

        const signer = provider.getSigner()
        const user = await signer.getAddress()

        let stakedTokens = Array.from((await staking_contract.tokensOfOwner(user)), x => Number(x))
        console.log("staked tokens ", stakedTokens);
       
        const currentSupply = await staking_contract.totalItemsStaked();
        
        const maxSupply = await nft_contract.totalSupply();
        console.log("max supply",Number(maxSupply))
              
        let userTokens: any = await GetUserNfts(user.toString());
        console.log("res from fn",userTokens)

        if (Array.isArray(userTokens)) {
          userTokens = userTokens.filter((id: any) => !stakedTokens.includes(id)).sort();
          console.log("user Tokens", userTokens);
        } else {
          console.error("User tokens are not an array:", userTokens);
        }

        setInfo({
            currentSupply: Number(currentSupply),
            maxSupply: Number(maxSupply),
            userNftIds: userTokens,
            stakedNftIds: stakedTokens,
            
        })

        const _userNfts: any = await Promise.all(userTokens.map(async (nft: any) => {
          
          const tokenUri = await nft_contract.tokenURI(nft);
          const res = await getNftInfoFromUri(tokenUri.toString());
          console.log(res);
          return {
            name: res?.name,
            id: nft,
            imageUri: res?.imageUri
          }
      }))

      setUserNfts(_userNfts);

       const _stakedNfts: any = await Promise.all(stakedTokens.map(async (nft) => {
         
          const tokenUri = await nft_contract.tokenURI(nft);
          const res = await getNftInfoFromUri(tokenUri.toString());
          console.log(res);
          return {
            name: res?.name,
            id: nft,
            imageUri: res?.imageUri
          }
      }))

      setStakedNfts(_stakedNfts);
      setShowLoader(false);
       
      }
    }catch(e){
      console.log("error",e);
      setShowLoader(false);
    }
  }

  const getNftInfoFromUri = async (tokenUri: any) => {
    try {
        // Use https://ipfs.io/ipfs/ to fetch the JSON metadata from the token URI
        const response = await fetch(`https://ipfs.io/ipfs/${tokenUri.replace("ipfs://", "")}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const metadata = await response.json();

        // Assuming metadata structure includes 'name', 'id', and 'image'
        const nftInfo = {
            name: metadata.name,
            id: metadata.id,
            imageUri: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            // Add other properties as needed based on your metadata structure
        };

        return nftInfo;
    } catch (error) {
        console.error('Error fetching NFT info:', error);
        // Handle errors if needed
        return null;
    }
};







  const handleUnstackProduct = (e: boolean, i: number) => {
    if (e) {
      if (unStackProductIds.length >= 10) {
        toast.error('You can unstake 10 NFTs in maximum at once.')
        return;
      }
      setUnStackProduct([...unStackProductIds, i]);
    } else {
      setUnStackProduct(unStackProductIds.filter((item) => item !== i));
    }
  };

   const handleStakedProduct = (e: boolean, i: number) => {
    if (e) {
      if (unStackProductIds.length >= 10) {
        toast.error('You can stake 10 NFTs in maximum at once.')
        return;
      }
      setStakedProduct([...stakedProductIds, i]);
    } else {
      setStakedProduct(stakedProductIds.filter((item) => item !== i));
    }
  };

  const handleStake = async () => {
    if (unStackProductIds.length <= 0) {
      toast.error("Select NFTs, please.");
      return;
    }
    setShowLoader(true);
    let staking_nfts = [];
    for (let i = 0; i < unStackProductIds.length; i++) {
      staking_nfts.push(userNfts[unStackProductIds[i]]);
    }
    var filtered = userNfts.filter(function (value :any, index: any, arr: any) {
      return unStackProductIds.indexOf(index) === -1;
    });



    const staking_nftIds = staking_nfts.map((nft) => nft.id);
    console.log("stakeItem param", staking_nftIds);
    const res = await stakeItem(staking_nftIds);
    if (res === 1) {
      setUnStackProduct([]);
      setStakedNfts(stakedNfts.concat(staking_nfts));
      await getInfo();
      toast.success("NFT unstaked succesfully");
    }
  };

  const handleStakeAll = async () => {
    if (userNfts.length <= 0) {
      toast.error("No NFTs.");
      return;
    }
    setShowLoader(true);
   
    const staking_nftIds = userNfts.map((nft: any) => nft.id);

    const res = await stakeItem( staking_nftIds.filter((_nft: any, index: number) => index < 10));
    if (res === 1) {
      setUnStackProduct([]);
      setStakedNfts(stakedNfts.concat(staking_nftIds.filter((_nft: any, index: number) => index < 10)));
      await getInfo();
      toast.success("NFT staked succesfully");
    }
  };
  const stopLoader = () => {
    setShowLoader(false);
    setLoadingMessage("");
  };

  const handleUnStake = async () => {
    if (stakedProductIds.length <= 0) {
      toast.error("Select NFTs, please");
      return;
    }
    setShowLoader(true);
    let unstaking_nfts = [];
    for (let i = 0; i < stakedProductIds.length; i++) {
      unstaking_nfts.push(stakedNfts[stakedProductIds[i]]);
    }

    var filtered = stakedNfts.filter(function (value:any, index:any, arr:any) {
      return stakedProductIds.indexOf(index) === -1;
    });

    const unstaking_nftsId = unstaking_nfts.map((nft) => nft.id);
    const res = await unstakeItem(unstaking_nftsId);
    if (res === 1) {
      setStakedProduct([]);
      await getInfo();
      toast.success("NFT unstaked succesfully");
    }
  };

  const handleUnStakeAll = async () => {
    if (stakedNfts.length <= 0) {
      toast.error("No NFTs.");
      return;
    }
    setShowLoader(true);
    const unstaking_nftIds = stakedNfts.map((nft: any) => nft.id);
    const res = await unstakeItem(unstaking_nftIds.filter((_nft: any, index: number) => index < 10));
    if (res === 1) {
      setStakedProduct([]);
      await getInfo();
      toast.success("NFT unstaked succesfully");
    }
  };

  const handleClaim = async () => {
    if (stakedNfts.length <= 0) {
      toast.error("No NFTs.");
      return;
    }
    setShowLoader(true);
    const claim_nftIds = stakedNfts.map((nft: any) => nft.id);
    const res = await claim(claim_nftIds);
    if (res === 1) {
      setStakedProduct([]);
      await getInfo();
      toast.success("Rewards claimed succesfully");
    }
  };



  return (
    <>
      <div className="text-white body-bg">
       {(showLoader) && (
        <Loader text={loadingMessage} />
      )} 
        <div className="px-4 min-h-screen max-w-7xl mx-auto">
          {/* Main Navbar */}
          <nav className="flex items-center justify-between py-5">
            <a href="/">
              <span className="font-extrabold text-2xl sm:text-4xl italic text-white">BasePunk</span>
            </a>
            <ul className="flex items-center justify-center md:justify-start">
              <li>
                <a
                  href="#"
                  className="text-white opacity-30 cursor-pointer hover:text-4ccbc9 hover:opacity-100 relative"
                  title="home"
                >
                  <span className="font-bold text-base sm:text-xl">HOME</span>
                 
                </a>
              </li>
              <li className="text-base flex ml-4">
                {walletStatus.status === `connected` ? (
                  <div
                    className="text-indigo-600 bg-white rounded-[4px]  hover:bg-green-500 py-[0.5rem] px-[1rem] cursor-pointer"
                    onClick={handleDisConnect}
                  >
                    {walletStatus?.address
                      ? walletStatus?.address?.substr(0, 6) +
                      "..." +
                      walletStatus?.address?.substr(
                        storeData?.address.length - 4,
                        4
                      )
                      : `Connect Wallet`}
                  </div>
                ) : (
                  <div
                    className="text-indigo-600 bg-white rounded-[4px] py-[0.5rem] px-[1rem] cursor-pointer  hover:bg-green-500"
                    onClick={handleConnect}
                  >
                    Connect Wallet
                  </div>
                )}
              </li>
              <ToastContainer/>
            </ul>
          </nav>
          <h2
            className="text-center mt-5"
            // style={{
            //   textAlign: "center",
            //   justifyContent: "center",
            //   alignItems: "center",
            //   // backgroundColor: "lightblue",
            //   width: "100%",
            //   borderRadius: "10px",
            // }}
          >
            NFT's Staked: {totalStakedNfts}/ {maxNftsSupply}
          
          </h2>
          <ProgressBar bgcolor="#ef6c00" completed={totalStakedNfts} totalSupply= {maxNftsSupply} />

          {/* Bonus Claim Bar  */}
          <div className="sm:flex items-center justify-between mt-10 bg-LightPurple rounded-2xl sm:py-8 py-5 md:px-11 sm:px-8 px-5">
            <h1 className="text-2xl">Stake and earn rewards (5 $BPunk / Day)</h1>
            <div className="sm:flex items-center">
              <h1 className="my-5 sm:my-0 text-2xl">{Number(reward).toFixed(3)} $BPunk</h1>
              <button
                className="sm:ml-5 bg-pink-600 text-white py-2 px-8 rounded-md font-semibold hover:bg-green-500 hover:text-black"
                title="COMING SOON"
                onClick={() => {
                  handleClaim().then(() => {
                    stopLoader();
                  });
                }}
              >
                CLAIM
              </button>
            </div>
          </div>
          {/* Staking Main  */}
          <div className="flex flex-col md:flex-row justify-between mt-10 gap-6">
            {/* Left  */}
            <div className="p-4 w-full md:w-1/2 rounded-lg sm:rounded-2xl md:rounded-3xl bg-gradient-to-r from-Secprimary to-Secsecondary">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm sm:text-base">NFTs in wallet: {userNfts?.length}</p>

                <div className="flex items-center gap-4">
                  <button
                    className=" bg-pink-600 text-white px-3 md:px-6 lg:px-6 py-2 rounded-md font-semibold hover:bg-green-500 hover:text-black text-sm sm:text-base"
                    onClick={() => {
                      handleStake().then(() => {
                        stopLoader();
                      });
                    }}
                  >
                    Stake
                  </button>
                  <button
                    className="bg-white text-black py-2 px-3 md:px-6 lg:px-8 rounded-md font-semibold hover:bg-green-500 hover:text-black text-sm sm:text-base"
                    onClick={() => {
                      handleStakeAll().then(() => {
                        stopLoader();
                      });
                    }}
                  >
                    Stake All
                  </button>
                </div>
              </div>
             
              {/* Staking Container  */}
            <div className="flex gap-3 flex-wrap mt-3 panel">
              {userNfts?.length > 0 ? (
                userNfts?.map((nft:any, idx: any) => {
                  return (
                    <Stake
                      key={idx}
                      selected={unStackProductIds.indexOf(idx) !== -1}
                      nft={nft}
                      index={idx}
                      image={nft.imageUri}
                      name={nft.name}
                      handleOrderCollect={handleUnstackProduct}
                    />
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "12em 1em",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "lightblue",
                    width: "100%",
                    borderRadius: "10px",
                    margin: "1em 1em",
                  }}
                >
                  {!(showLoader) &&
                    "No NFTs"}
                </div>
              )}
            </div>
          </div>
            {/* Right  */}
            <div className="p-4 w-full md:w-1/2 rounded-lg sm:rounded-2xl md:rounded-3xl bg-gradient-to-r from-Secprimary to-Secsecondary">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm sm:text-base">Staked NFTs : {stakedNfts?.length}</p>

                <div className="flex items-center gap-4">
                  <button
                    className="bg-pink-600  text-white py-2 px-3 md:px-6 lg:px-8 rounded-md font-semibold hover:bg-green-500 hover:text-black text-sm sm:text-base"
                    onClick={() => {
                      handleUnStake().then(() => {
                        stopLoader();
                      });
                    }}
                  >
                    UnStake
                  </button>
                  <button
                    className="bg-white text-black py-2 px-3 md:px-6 lg:px-8 rounded-md font-semibold hover:bg-green-500 hover:text-black text-sm sm:text-base"
                    onClick={() => {
                      handleUnStakeAll().then(() => {
                        stopLoader();
                      });
                    }}
                  >
                    UnStake All
                  </button>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap mt-3 panel">
              {stakedNfts?.length > 0 ? (
                stakedNfts.map((nft: any, idx: any) => {
                  return (
                    <UnStake
                      key={idx}
                      selected={stakedProductIds.indexOf(idx) !== -1}
                      nft={nft}
                      index={idx}
                      image={nft.imageUri}
                      name={nft.name}
                      handleOrderCollect={handleStakedProduct}
                    />
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "12em 1em",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "lightblue",
                    width: "100%",
                    borderRadius: "10px",
                    margin: "1em 1em",
                  }}
                >
                  {!(showLoader) &&
                    "No NFTs"}
                </div>
              )}
              </div>
            </div>
            
          </div>

          <div className="mt-10 panel">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {nfts.map((nft) => (
                <div key={nft.id} className="col-span-1">
                  <img src={nft.imageUrl} alt={nft.name} className="w-full h-auto rounded-md" />
                </div>
              ))}
            </div>
          </div>
         
          <footer className="md:pt-footer pt-footersm md:pb-footer pb-bfooter">
            <div className="sm:flex items-center justify-between gap-4">
              <div className="flex-1">
                <a href="/" className="flex items-center justify-center sm:block">
                  <span className="font-extrabold text-3xl sm:text-4xl italic text-white">BasePunk</span>
                </a>
                <span className="text-sm sm:text-base mt-2 sm:mt-6 block text-center sm:text-left">
                  Base punk is a digital collection and global community of creators, developers, and innovators. We are
                  the change makers.
                </span>
              </div>
              <div className="mt-4 sm:mt-0 text-center flex-1">
                <h4 className="text-sm sm:text-base sm:text-center md:text-start">Follow us</h4>
                <ul className="my-4 sm:my-5 md:items-start flex items-center justify-center">
                  <li className="sm:mx-5">
                    <a href="https://discord.gg/tVzdjzFX4V" target="_blank" rel="noreferrer">
                      <img
                        src={"https://cdn0.iconfinder.com/data/icons/tuts/256/telegram.png"}
                        alt="Telegram"
                        className="w-10"
                      />
                    </a>
                  </li>
                  <li className="mx-5">
                    <a href=" https://twitter.com/solswipecard" target="_blank" rel="noreferrer">
                      <img
                        src={
                          "https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?size=626&ext=jpg"
                        }
                        alt="Twitter"
                        className="w-8"
                      />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="text-center flex-1">
                <p className="text-sm sm:text-base text-center md:text-start">Copyright @ 2023 , Made by Base punk</p>
                <p className="text-sm sm:text-base text-center md:text-start">
                Developed by{''}
                <a
                  className="hover:text-black text-blue-500  transition duration-300 ml-2" // Add margin-left
                  href="https://www.2xsolution.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  2x Solution
                </a>
              </p>

              </div>
            </div>
          </footer>

          {/* MODAL  */}

          {/* {showClaimListModal && (
          <CliamListModal
            isClaimEnable={isClaimEnable}
            handleClose={setShowClaimListModal}
            handleTweet={onHandleTweet}
            handleClaimToken={onClaimToken}
            handleUser={setShowUserModal}
          />
        )} */}

          {/* {showTweetModal && (
          <TwitterModal
            tweetId={tweetId}
            walletAddress={publicKey?.toString()}
            options={tweetOptions}
            handleClose={setShowTweetModal}
            handleClaimEnable={setClaimEnable}
          />
        )}

        {showUserModal && (
          <UserModal
            tweetId={tweetId}
            walletAddress={publicKey?.toString()}
            handleClose={setShowUserModal}
            handleClaimEnable={setClaimEnable}
          />
        )} */}
        </div>
      </div>
    </>
  );
};

export default Home;

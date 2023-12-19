export const COLLECTION_NAME = "Solswipe";
export const CREATOR = "D8ewaDbjGTg9F8yeWDyrcdZE48FWMhaDpUqKbEw1AZn1"
export const COLLECTION_SYMBOL = "solswipe";

export const STAKE_STATUS = {
  UNSTAKED: 0,
  STAKED: 1,
};
export const STAKE_DATA_SIZE = 432

export const STAKE_CONTRACT_IDL =
{
  "version": "0.1.0",
  "name": "solswipe_staking",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initUserPool",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stakeNft",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPoolData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sourceNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstakeNft",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPoolData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sourceNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimReward",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPoolAllocate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "calcMonthTotalReward",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "monthInfo",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setClaimable",
      "accounts": [
        {
          "name": "userPoolAllocate",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "allocateReward",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "monthInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPoolAllocate",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferSol",
      "accounts": [
        {
          "name": "monthInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "month",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "GlobalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakedCount",
            "type": "u32"
          },
          {
            "name": "totalReward",
            "type": "u64"
          },
          {
            "name": "rewardTime",
            "type": "i64"
          },
          {
            "name": "allocateTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "MonthInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "totalReward",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UserPoolData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "AllocateInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allocatedTime",
            "type": "i64"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "isClaimed",
            "type": "bool"
          },
          {
            "name": "isClaimable",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "UserPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "stakedCount",
            "type": "u32"
          },
          {
            "name": "totalReward",
            "type": "u64"
          },
          {
            "name": "earnedReward",
            "type": "u64"
          },
          {
            "name": "rewardTime",
            "type": "i64"
          },
          {
            "name": "counter",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidUserPool",
      "msg": "Invalid User Pool"
    },
    {
      "code": 6001,
      "name": "InvalidPoolError",
      "msg": "Invalid pool number"
    },
    {
      "code": 6002,
      "name": "InvalidNFTAddress",
      "msg": "No Matching NFT to withdraw"
    },
    {
      "code": 6003,
      "name": "InvalidOwner",
      "msg": "NFT Owner key mismatch"
    },
    {
      "code": 6004,
      "name": "InvalidWithdrawTime",
      "msg": "Staking Locked Now"
    },
    {
      "code": 6005,
      "name": "IndexOverflow",
      "msg": "Withdraw NFT Index OverFlow"
    },
    {
      "code": 6006,
      "name": "LackLamports",
      "msg": "Insufficient Lamports"
    },
    {
      "code": 6007,
      "name": "InvalidRewardAmount",
      "msg": "Invalid reward amount"
    }
  ],
  "metadata": {
    "address": "AsKixSgYhyhHcp7Ne5NyMEkn1KREW2YD2ZEsaNiU8J69"
  }
}
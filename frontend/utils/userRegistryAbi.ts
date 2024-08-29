export const userRegistryAbi = [
    {
      "name": "UserRegistryImpl",
      "type": "impl",
      "interface_name": "social_media_dapp::user_registry::IUserRegistry"
    },
    {
      "name": "core::bool",
      "type": "enum",
      "variants": [
        {
          "name": "False",
          "type": "()"
        },
        {
          "name": "True",
          "type": "()"
        }
      ]
    },
    {
      "name": "core::integer::u256",
      "type": "struct",
      "members": [
        {
          "name": "low",
          "type": "core::integer::u128"
        },
        {
          "name": "high",
          "type": "core::integer::u128"
        }
      ]
    },
    {
      "name": "social_media_dapp::user_registry::User",
      "type": "struct",
      "members": [
        {
          "name": "address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "username",
          "type": "core::felt252"
        },
        {
          "name": "email",
          "type": "core::felt252"
        },
        {
          "name": "bio",
          "type": "core::felt252"
        },
        {
          "name": "registered",
          "type": "core::bool"
        },
        {
          "name": "token_balance",
          "type": "core::integer::u256"
        }
      ]
    },
    {
      "name": "social_media_dapp::user_registry::Post",
      "type": "struct",
      "members": [
        {
          "name": "id",
          "type": "core::integer::u64"
        },
        {
          "name": "hash_high",
          "type": "core::integer::u256"
        },
        {
          "name": "hash_low",
          "type": "core::integer::u256"
        },
        {
          "name": "author",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64"
        },
        {
          "name": "likes",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "name": "social_media_dapp::user_registry::Comment",
      "type": "struct",
      "members": [
        {
          "name": "id",
          "type": "core::integer::u64"
        },
        {
          "name": "post_id",
          "type": "core::integer::u64"
        },
        {
          "name": "author",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "content",
          "type": "core::felt252"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "name": "social_media_dapp::user_registry::IUserRegistry",
      "type": "interface",
      "items": [
        {
          "name": "register_user",
          "type": "function",
          "inputs": [
            {
              "name": "username",
              "type": "core::felt252"
            },
            {
              "name": "email",
              "type": "core::felt252"
            },
            {
              "name": "bio",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "get_user",
          "type": "function",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "social_media_dapp::user_registry::User"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "update_profile",
          "type": "function",
          "inputs": [
            {
              "name": "username",
              "type": "core::felt252"
            },
            {
              "name": "email",
              "type": "core::felt252"
            },
            {
              "name": "bio",
              "type": "core::felt252"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "is_registered",
          "type": "function",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "create_post",
          "type": "function",
          "inputs": [
            {
              "name": "hash_high",
              "type": "core::integer::u256"
            },
            {
              "name": "hash_low",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u64"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_posts",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::array::Array::<social_media_dapp::user_registry::Post>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "like_post",
          "type": "function",
          "inputs": [
            {
              "name": "post_id",
              "type": "core::integer::u64"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "add_comment",
          "type": "function",
          "inputs": [
            {
              "name": "post_id",
              "type": "core::integer::u64"
            },
            {
              "name": "content",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u64"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_comments",
          "type": "function",
          "inputs": [
            {
              "name": "post_id",
              "type": "core::integer::u64"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<social_media_dapp::user_registry::Comment>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_token_balance",
          "type": "function",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "transfer_tokens",
          "type": "function",
          "inputs": [
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "amount",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "name": "constructor",
      "type": "constructor",
      "inputs": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "social_media_dapp::user_registry::UserRegistry::UserRegistered",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "username",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "social_media_dapp::user_registry::UserRegistry::PostCreated",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "post_id",
          "type": "core::integer::u64"
        },
        {
          "kind": "data",
          "name": "author",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "social_media_dapp::user_registry::UserRegistry::CommentAdded",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "post_id",
          "type": "core::integer::u64"
        },
        {
          "kind": "data",
          "name": "comment_id",
          "type": "core::integer::u64"
        },
        {
          "kind": "data",
          "name": "author",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "social_media_dapp::user_registry::UserRegistry::TokensRewarded",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "amount",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "reason",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "social_media_dapp::user_registry::UserRegistry::Event",
      "type": "event",
      "variants": [
        {
          "kind": "nested",
          "name": "UserRegistered",
          "type": "social_media_dapp::user_registry::UserRegistry::UserRegistered"
        },
        {
          "kind": "nested",
          "name": "PostCreated",
          "type": "social_media_dapp::user_registry::UserRegistry::PostCreated"
        },
        {
          "kind": "nested",
          "name": "CommentAdded",
          "type": "social_media_dapp::user_registry::UserRegistry::CommentAdded"
        },
        {
          "kind": "nested",
          "name": "TokensRewarded",
          "type": "social_media_dapp::user_registry::UserRegistry::TokensRewarded"
        }
      ]
    }
  ]
use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
struct User {
    address: ContractAddress,
    username: felt252,
    email: felt252,
    bio: felt252,
    registered: bool,
    token_balance: u256,
}

#[derive(Drop, Serde, starknet::Store, Clone)]
struct Post {
    id: u64,
    hash_high: u256,
    hash_low: u256,
    author: ContractAddress,
    timestamp: u64,
    likes: u64,
}

#[derive(Drop, Serde, starknet::Store)]
struct Comment {
    id: u64,
    post_id: u64,
    author: ContractAddress,
    content: felt252,
    timestamp: u64,
}

#[starknet::interface]
trait IUserRegistry<TContractState> {
    fn register_user(ref self: TContractState, username: felt252, email: felt252, bio: felt252);
    fn get_user(self: @TContractState, address: ContractAddress) -> User;
    fn update_profile(ref self: TContractState, username: felt252, email: felt252, bio: felt252);
    fn is_registered(self: @TContractState, address: ContractAddress) -> bool;
    fn create_post(ref self: TContractState, hash_high: u256, hash_low: u256) -> u64;
    // fn get_post(self: @TContractState, post_id: u64) -> Post;
    fn get_posts(self: @TContractState) -> Array<Post>;
    fn like_post(ref self: TContractState, post_id: u64);
    fn add_comment(ref self: TContractState, post_id: u64, content: felt252) -> u64;
    fn get_comments(self: @TContractState, post_id: u64) -> Array<Comment>;

    // New functions for token and NFT support
    fn get_token_balance(self: @TContractState, address: ContractAddress) -> u256;
    fn transfer_tokens(ref self: TContractState, to: ContractAddress, amount: u256);
    // fn get_contract_owner(self: @TContractState) -> ContractAddress;
    // fn set_social_token_address(ref self: TContractState, address: ContractAddress);
    // fn transfer_ownership(ref self: TContractState, new_owner: ContractAddress);
}

#[starknet::contract]
mod UserRegistry {
    use super::{User, Post, Comment, IUserRegistry, ContractAddress};
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;

    const LIKE_REWARD: u256 = 1;
    const COMMENT_REWARD: u256 = 2;
    const INITIAL_TOKEN_BALANCE: u256 = 1000;

    #[storage]
    struct Storage {
        users: LegacyMap::<ContractAddress, User>,
        posts: LegacyMap::<u64, Post>,
        comments: LegacyMap::<(u64, u64), Comment>, // (post_id, comment_id) -> Comment
        next_post_id: u64,
        next_comment_id: u64,
        // contract_owner: ContractAddress, // contract owner address
        social_token_address: ContractAddress, // social token address
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistered: UserRegistered,
        PostCreated: PostCreated,
        CommentAdded: CommentAdded,
        TokensRewarded: TokensRewarded,
    }

    #[derive(Drop, starknet::Event)]
    struct UserRegistered {
        address: ContractAddress,
        username: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct PostCreated {
        post_id: u64,
        author: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct CommentAdded {
        post_id: u64,
        comment_id: u64,
        author: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct TokensRewarded {
        user: ContractAddress,
        amount: u256,
        reason: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct NFTCreated {
        post_id: u64,
        creator: ContractAddress,
        price: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.next_post_id.write(1);
        self.next_comment_id.write(1);
        // write the contract owner addrss
        // self.contract_owner.write(owner);
    }

    #[abi(embed_v0)]
    impl UserRegistryImpl of IUserRegistry<ContractState> {
        fn register_user(ref self: ContractState, username: felt252, email: felt252, bio: felt252) {
            let caller = get_caller_address();
            assert(!self.users.read(caller).registered, 'User already registered');

            let new_user = User {
                address: caller,
                username: username,
                email: email,
                bio: bio,
                registered: true,
                token_balance: INITIAL_TOKEN_BALANCE, // when the user registry, give them some innitial token balance
            };
            self.users.write(caller, new_user);

            self.emit(Event::UserRegistered(UserRegistered { address: caller, username: username }));
            self.emit(Event::TokensRewarded(TokensRewarded {
                user: caller,
                amount: INITIAL_TOKEN_BALANCE,
                reason: 'initial_balance',
            }));
        }

        fn get_user(self: @ContractState, address: ContractAddress) -> User {
            let user = self.users.read(address);
            assert(user.registered, 'User not found');
            user
        }

        fn update_profile(ref self: ContractState, username: felt252, email: felt252, bio: felt252) {
            let caller = get_caller_address();
            let mut user = self.users.read(caller);
            assert(user.registered, 'User not registered');
            user.username = username;
            user.email = email;
            user.bio = bio;
            self.users.write(caller, user);
        }

        fn is_registered(self: @ContractState, address: ContractAddress) -> bool {
            self.users.read(address).registered
        }

        fn create_post(ref self: ContractState, hash_high: u256, hash_low: u256) -> u64 {
            let caller = get_caller_address();
            assert(self.users.read(caller).registered, 'User not registered');

            let post_id = self.next_post_id.read();
            let new_post = Post {
                id: post_id,
                hash_high: hash_high,
                hash_low: hash_low,
                author: caller,
                timestamp: get_block_timestamp(),
                likes: 0,
            };
            self.posts.write(post_id, new_post);
            self.next_post_id.write(post_id + 1);

            self.emit(Event::PostCreated(PostCreated { post_id: post_id, author: caller }));
            post_id
        }

        // fn get_post(self: @ContractState, post_id: u64) -> Post {
        //     let post = self.posts.read(post_id);
        //     assert(post.id != 0, 'Post not found');
        //     post
        // }

        fn get_posts(self: @ContractState) -> Array<Post> {
            let mut posts = ArrayTrait::new();
            let mut i = 1;
            loop {
                if i >= self.next_post_id.read() {
                    break;
                }
                let post = self.posts.read(i);
                if post.id != 0 {
                    posts.append(post);
                }
                i += 1;
            };
            posts
        }

        fn like_post(ref self: ContractState, post_id: u64) {
            let caller = get_caller_address();
            assert(self.users.read(caller).registered, 'User not registered');

            let mut post = self.posts.read(post_id);
            assert(post.id != 0, 'Post not found');
            post.likes += 1;
            self.posts.write(post_id, post.clone());

            // Reward post author with tokens
            let mut author = self.users.read(post.author);
            author.token_balance += LIKE_REWARD;
            self.users.write(post.author, author);

            self.emit(Event::TokensRewarded(TokensRewarded {
                user: post.author,
                amount: LIKE_REWARD,
                reason: 'post_like',
            }));
        }

        fn add_comment(ref self: ContractState, post_id: u64, content: felt252) -> u64 {
            let caller = get_caller_address();
            assert(self.users.read(caller).registered, 'User not registered');
            assert(self.posts.read(post_id).id != 0, 'Post not found');

            let comment_id = self.next_comment_id.read();
            let new_comment = Comment {
                id: comment_id,
                post_id: post_id,
                author: caller,
                content: content,
                timestamp: get_block_timestamp(),
            };
            self.comments.write((post_id, comment_id), new_comment);
            self.next_comment_id.write(comment_id + 1);

            // Reward post author with tokens
            let post = self.posts.read(post_id);
            let mut author = self.users.read(post.author);
            author.token_balance += COMMENT_REWARD;
            self.users.write(post.author, author);

            self.emit(Event::CommentAdded(CommentAdded { post_id: post_id, comment_id: comment_id, author: caller }));
            self.emit(Event::TokensRewarded(TokensRewarded {
                user: post.author,
                amount: COMMENT_REWARD,
                reason: 'post_comment',
            }));

            comment_id
        }

        fn get_comments(self: @ContractState, post_id: u64) -> Array<Comment> {
            let mut comments = ArrayTrait::new();
            let mut i = 1;
            loop {
                if i >= self.next_comment_id.read() {
                    break;
                }
                let comment = self.comments.read((post_id, i));
                if comment.id != 0 {
                    comments.append(comment);
                }
                i += 1;
            };
            comments
        }

        fn get_token_balance(self: @ContractState, address: ContractAddress) -> u256 {
            self.users.read(address).token_balance
        }

        fn transfer_tokens(ref self: ContractState, to: ContractAddress, amount: u256) {
            let caller = get_caller_address();
            let mut sender = self.users.read(caller);
            assert(sender.token_balance >= amount, 'Insufficient balance');
            
            sender.token_balance -= amount;
            self.users.write(caller, sender);

            let mut recipient = self.users.read(to);
            recipient.token_balance += amount;
            self.users.write(to, recipient);
        }

        // fn get_contract_owner(self: @ContractState) -> ContractAddress {
        //     self.contract_owner.read()
        // }

        // fn set_social_token_address(ref self: ContractState, address: ContractAddress) {
        //     assert(starknet::get_caller_address() == self.contract_owner.read(), 'Only owner can set token');
        //     self.social_token_address.write(address);
        // }

        // fn transfer_ownership(ref self: ContractState, new_owner: ContractAddress) {
        //     assert(get_caller_address() == self.contract_owner.read(), 'Not owner');
        //     self.contract_owner.write(new_owner);
        // }
    }
}
use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
struct User {
    address: ContractAddress,
    username: felt252,
    email: felt252,
    bio: felt252,
    registered: bool,
}

#[derive(Drop, Serde, starknet::Store)]
struct Post {
    id: u64,
    title: felt252,
    content: felt252,
    image: felt252,
    author: ContractAddress,
    timestamp: u64,
    likes: u64,
}

#[starknet::interface]
trait IUserRegistry<TContractState> {
    fn register_user(ref self: TContractState, username: felt252, email: felt252, bio: felt252);
    fn get_user(self: @TContractState, address: ContractAddress) -> User;
    fn update_bio(ref self: TContractState, new_bio: felt252);
    fn is_registered(self: @TContractState, address: ContractAddress) -> bool;
    fn create_post(ref self: TContractState, title: felt252, content: felt252, image: felt252) -> u64;
    fn get_post(self: @TContractState, post_id: u64) -> Post;
    fn get_posts(self: @TContractState) -> Array<Post>;
    fn like_post(ref self: TContractState, post_id: u64);
}

#[starknet::contract]
mod UserRegistry {
    use super::{ContractAddress, User, Post, IUserRegistry};
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;

    #[storage]
    struct Storage {
        users: LegacyMap::<ContractAddress, User>,
        posts: LegacyMap::<u64, Post>,
        next_post_id: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistered: UserRegistered,
        PostCreated: PostCreated,
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

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.next_post_id.write(1);
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
            };
            self.users.write(caller, new_user);

            self.emit(Event::UserRegistered(UserRegistered { address: caller, username: username }));
        }

        fn get_user(self: @ContractState, address: ContractAddress) -> User {
            let user = self.users.read(address);
            assert(user.registered, 'User not found');
            user
        }

        fn update_bio(ref self: ContractState, new_bio: felt252) {
            let caller = get_caller_address();
            let mut user = self.users.read(caller);
            assert(user.registered, 'User not registered');
            user.bio = new_bio;
            self.users.write(caller, user);
        }

        fn is_registered(self: @ContractState, address: ContractAddress) -> bool {
            self.users.read(address).registered
        }

        fn create_post(ref self: ContractState, title: felt252, content: felt252, image: felt252) -> u64 {
            let caller = get_caller_address();
            assert(self.users.read(caller).registered, 'User not registered');

            let post_id = self.next_post_id.read();
            let new_post = Post {
                id: post_id,
                title: title,
                content: content,
                image: image,
                author: caller,
                timestamp: get_block_timestamp(),
                likes: 0,
            };
            self.posts.write(post_id, new_post);
            self.next_post_id.write(post_id + 1);

            self.emit(Event::PostCreated(PostCreated { post_id: post_id, author: caller }));
            post_id
        }

        fn get_post(self: @ContractState, post_id: u64) -> Post {
            let post = self.posts.read(post_id);
            assert(post.id != 0, 'Post not found');
            post
        }

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
            let mut post = self.posts.read(post_id);
            assert(post.id != 0, 'Post not found');
            post.likes += 1;
            self.posts.write(post_id, post);
        }
    }
}
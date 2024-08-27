use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
struct User {
    address: ContractAddress,
    username: felt252,
    email: felt252,
    bio: felt252,
    profile_image: felt252,
    registered: bool,
}

#[derive(Drop, Serde, starknet::Store)]
struct Post {
    id: u64,
    hash: felt252,  // Only storing the IPFS hash
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
    fn register_user(ref self: TContractState, username: felt252, email: felt252, bio: felt252, profile_image: felt252);
    fn get_user(self: @TContractState, address: ContractAddress) -> User;
    fn update_profile(ref self: TContractState, username: felt252, email: felt252, bio: felt252, profile_image: felt252);
    fn is_registered(self: @TContractState, address: ContractAddress) -> bool;
    fn create_post(ref self: TContractState, hash: felt252) -> u64;  // Only taking the hash as input
    fn get_post(self: @TContractState, post_id: u64) -> Post;
    fn get_posts(self: @TContractState) -> Array<Post>;
    fn like_post(ref self: TContractState, post_id: u64);
    fn add_comment(ref self: TContractState, post_id: u64, content: felt252) -> u64;
    fn get_comments(self: @TContractState, post_id: u64) -> Array<Comment>;
}

#[starknet::contract]
mod UserRegistry {
    use super::{ContractAddress, User, Post, Comment, IUserRegistry};
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;

    #[storage]
    struct Storage {
        users: LegacyMap::<ContractAddress, User>,
        posts: LegacyMap::<u64, Post>,
        comments: LegacyMap::<(u64, u64), Comment>, // (post_id, comment_id) -> Comment
        next_post_id: u64,
        next_comment_id: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistered: UserRegistered,
        PostCreated: PostCreated,
        CommentAdded: CommentAdded,
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

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.next_post_id.write(1);
        self.next_comment_id.write(1);
    }

    #[abi(embed_v0)]
    impl UserRegistryImpl of IUserRegistry<ContractState> {
        fn register_user(ref self: ContractState, username: felt252, email: felt252, bio: felt252, profile_image: felt252) {
            let caller = get_caller_address();
            assert(!self.users.read(caller).registered, 'User already registered');

            let new_user = User {
                address: caller,
                username: username,
                email: email,
                bio: bio,
                profile_image: profile_image,
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

        fn update_profile(ref self: ContractState, username: felt252, email: felt252, bio: felt252, profile_image: felt252) {
            let caller = get_caller_address();
            let mut user = self.users.read(caller);
            assert(user.registered, 'User not registered');
            user.username = username;
            user.email = email;
            user.bio = bio;
            user.profile_image = profile_image;
            self.users.write(caller, user);
        }

        fn is_registered(self: @ContractState, address: ContractAddress) -> bool {
            self.users.read(address).registered
        }

        fn create_post(ref self: ContractState, hash: felt252) -> u64 {
            let caller = get_caller_address();
            assert(self.users.read(caller).registered, 'User not registered');

            let post_id = self.next_post_id.read();
            let new_post = Post {
                id: post_id,
                hash: hash,
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

            self.emit(Event::CommentAdded(CommentAdded { post_id: post_id, comment_id: comment_id, author: caller }));
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
    }
}
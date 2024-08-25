use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
struct User {
    address: ContractAddress,
    username: felt252,
    email: felt252,
    bio: felt252,
    registered: bool,
}

#[starknet::interface]
trait IUserRegistry<TContractState> {
    fn register_user(
        ref self: TContractState,
        username: felt252,
        email: felt252,
        bio: felt252
    );
    fn get_user(self: @TContractState, address: ContractAddress) -> User;
    fn update_bio(ref self: TContractState, new_bio: felt252);
    fn is_registered(self: @TContractState, address: ContractAddress) -> bool;
}

#[starknet::contract]
mod UserRegistry {
    use super::{ContractAddress, User};
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        users: LegacyMap::<ContractAddress, User>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistered: UserRegistered,
    }

    #[derive(Drop, starknet::Event)]
    struct UserRegistered {
        address: ContractAddress,
        username: felt252,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        // Initialize contract if needed
    }

    #[abi(embed_v0)]
    impl UserRegistryImpl of super::IUserRegistry<ContractState> {
        fn register_user(
            ref self: ContractState,
            username: felt252,
            email: felt252,
            bio: felt252
        ) {
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
    }
}
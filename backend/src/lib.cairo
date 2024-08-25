#[starknet::interface]
trait ISimpleUser<TContractState> {
    fn get_name(self: @TContractState) -> felt252;
    fn set_name(ref self: TContractState, new_name: felt252);
}

#[starknet::contract]
mod SimpleUser {
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        name: felt252,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_name: felt252) {
        self.name.write(initial_name);
    }

    #[abi(embed_v0)]
    impl SimpleUserImpl of super::ISimpleUser<ContractState> {
        fn get_name(self: @ContractState) -> felt252 {
            self.name.read()
        }

        fn set_name(ref self: ContractState, new_name: felt252) {
            self.name.write(new_name);
        }
    }
}
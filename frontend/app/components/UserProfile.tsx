import React, { useState, useEffect } from 'react';
import { useProvider, useAccount } from "@starknet-react/core";
import { getTokenBalance, transferTokens, getSocialTokenBalance, transferSocialTokens } from '../utils/contract';

export default function UserProfile() {
  const [userTokenBalance, setUserTokenBalance] = useState('0');
  const [socialTokenBalance, setSocialTokenBalance] = useState('0');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const { provider } = useProvider();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (provider && isConnected && address) {
      fetchBalances();
    }
  }, [provider, isConnected, address]);

  const fetchBalances = async () => {
    try {
      const userBalance = await getTokenBalance(provider, address);
      setUserTokenBalance(userBalance.toString());
      const socialBalance = await getSocialTokenBalance(provider, address);
      setSocialTokenBalance(socialBalance.toString());
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !recipientAddress || !transferAmount) return;

    try {
      await transferTokens(provider, recipientAddress, transferAmount);
      fetchBalances();
      // Reset form or show success message
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  };

  const handleSocialTokenTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !recipientAddress || !transferAmount) return;

    try {
      await transferSocialTokens(provider, recipientAddress, transferAmount);
      fetchBalances();
      // Reset form or show success message
    } catch (error) {
      console.error("Error transferring social tokens:", error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p>User Token Balance: {userTokenBalance}</p>
      <p>Social Token Balance: {socialTokenBalance}</p>
      
      <form onSubmit={handleTransfer}>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <button type="submit">Transfer User Tokens</button>
      </form>

      <form onSubmit={handleSocialTokenTransfer}>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <button type="submit">Transfer Social Tokens</button>
      </form>
    </div>
  );
}
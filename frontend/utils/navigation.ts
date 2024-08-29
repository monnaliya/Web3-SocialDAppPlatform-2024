import { useRouter } from 'next/navigation';

export const useGoToPage = () => {
  const router = useRouter();
  return (page: string) => {
    router.push(page);
  };
};
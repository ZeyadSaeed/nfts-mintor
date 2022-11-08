import { FC } from "react";
import { HStack, Spacer } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";

const Navbar: FC = () => {
  const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    {
      ssr: false,
    }
  );

  return (
    <HStack width="full" padding={4}>
      <Spacer />
      <WalletMultiButton className={styles["wallet-adapter-button-trigger"]} />
    </HStack>
  );
};

export default Navbar;

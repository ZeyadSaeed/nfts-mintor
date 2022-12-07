import { FC, useCallback, useEffect, useState } from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  CandyMachineV2,
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import cache from "../tokens/candy-machine/cache.json";

const Connected: FC = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2>();
  const router = useRouter();
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const metaplex = Metaplex.make(connection).use(
    walletAdapterIdentity(walletAdapter)
  );

  useEffect(() => {
    async function run() {
      const candyMachine = await metaplex
        .candyMachinesV2()
        .findByAddress({ address: new PublicKey(cache.program.candyMachine) });

      setCandyMachine(candyMachine);
    }
    run();
  }, [metaplex, connection]);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      if (e.defaultPrevented) return;
      if (!walletAdapter.connected || !candyMachine) return;
      if (!walletAdapter.publicKey) return;
      try {
        setIsMinting(true);
        const nft = await metaplex.candyMachinesV2().mint({ candyMachine });

        console.log(nft);
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`);
      } catch (err) {
        alert(err);
      } finally {
        setIsMinting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metaplex, walletAdapter, candyMachine]
  );
  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Buildoor.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each buildoor is randomly generated and can be staked to receive
            <Text as="b"> $BLD</Text> Use your <Text as="b"> $BLD</Text> to
            upgrade your buildoor and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10} className={styles.imagesContainer}>
        <Image src="avatar1.png" alt="" />
        <Image src="avatar2.png" alt="" />
        <Image src="avatar3.png" alt="" />
        <Image src="avatar4.png" alt="" />
        <Image src="avatar5.png" alt="" />
      </HStack>

      <Button
        bgColor="accent"
        color="white"
        maxW="380px"
        onClick={handleClick}
        disabled={isMinting}
      >
        <HStack>
          <Text>mint buildoor</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  );
};

export default Connected;

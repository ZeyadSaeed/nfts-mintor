// REST OF YOUR CODE
import {
  Button,
  Text,
  HStack,
  Container,
  VStack,
  Heading,
} from "@chakra-ui/react";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { NextPage } from "next";
import Image from "next/image";
import MainLayout from "../components/MainLayout";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";

interface NewMintProps {
  mint: PublicKey;
}

const NewMint: NextPage<NewMintProps> = ({ mint }) => {
  const [metadata, setMetadata] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { connection } = useConnection();
  const walletAdapter = useWallet();
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  }, [connection, walletAdapter]);

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: new PublicKey(mint) });
      const res = await fetch(nft.uri);
      const metadata = await res.json();
      setMetadata(metadata);
      setIsLoading(false);
    }
    run();
  }, [mint, metaplex, walletAdapter]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {},
    []
  );

  return (
    <MainLayout>
      <VStack spacing={20}>
        <Container>
          <VStack spacing={8}>
            <Heading color="white" as="h1" size="2xl" textAlign="center">
              A new buildoor has appeared!
            </Heading>

            <Text color="bodyText" fontSize="lg" textAlign="center">
              Congratulations, you minted a lvl 1 buildoor! <br />
              Time to stake your character to earn rewards and level up.
            </Text>
          </VStack>
        </Container>

        {isLoading ? (
          "Loading...."
        ) : (
          <Image src={metadata?.image ?? ""} alt="" width={256} height={256} />
        )}

        <Button
          bgColor="accent"
          color="white"
          maxWidth="380px"
          onClick={handleClick}
        >
          <HStack>
            <Text>stake my buildoor</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </VStack>
    </MainLayout>
  );
};

NewMint.getInitialProps = async ({ query }) => {
  const { mint } = query;
  if (!mint) throw { error: "No mint" };

  try {
    const mintPubkey = new PublicKey(mint);
    return { mint: mintPubkey };
  } catch {
    throw { error: "Invalid mint" };
  }
};

export default NewMint;

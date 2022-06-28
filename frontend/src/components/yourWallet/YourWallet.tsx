import { Token } from "../Main";
import React, { useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { Tab } from "@material-ui/core";
import { WalletBalance } from "./WalletBalance";
import { StakeForm } from "./StakeForm"

interface YourWalletProps {
    supportedTokens: Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(2)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px"
    },
    header: {
        color: "white"
    }
}))

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
    const classes = useStyles();
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue));
    }

    return (
        <Box>
            <h2 className={classes.header}>Your Wallet!</h2>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList aria-label="stake form tabs" onChange={handleChange}>
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab label={token.name} value={index.toString()} key={index} />
                            );
                        })}
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div className={classes.tabContent}>
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]}></WalletBalance>
                                    <StakeForm token={supportedTokens[selectedTokenIndex]} />
                                </div>
                            </TabPanel>
                        );
                    })}
                </TabContext>
            </Box>
        </Box>
    );
}
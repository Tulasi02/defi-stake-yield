import { useEthers, useNotifications } from "@usedapp/core";
import { Token } from "../Main";
import { useTokenBalance } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { Button, CircularProgress, Input, Snackbar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useStakeTokens } from "../../hooks";
import { utils } from "ethers";
import Alert from "@material-ui/lab/Alert";

export interface StakeFormProps {
    token: Token
}

export const StakeForm = ({ token }: StakeFormProps) => {
    const { address: tokenAddress, name } = token;
    const { account } = useEthers();
    const tokenBalance = useTokenBalance(tokenAddress, account);
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0;
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0);
    const { approveAndStake, state } = useStakeTokens(tokenAddress);
    const { notifications } = useNotifications();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value);
        setAmount(newAmount);
    }

    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString());
        return approveAndStake(amountAsWei.toString());
    }

    const isMining = state.status === "Mining";
    const [showERC20ApprovalSuccess, setShowERC20ApprovalSuccess] = useState(false);
    const [showStakeTokenSuccess, setStakeTokenSuccess] = useState(false);

    const handleCloseSnack = () => {
        setShowERC20ApprovalSuccess(false);
        setStakeTokenSuccess(false);
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" && notification.transactionName === "Approve ERC20 transfer"
        ).length > 0) {
            setShowERC20ApprovalSuccess(true);
            setStakeTokenSuccess(false);
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" && notification.transactionName === "Stake Tokens"
        ).length > 0) {
            setShowERC20ApprovalSuccess(false);
            setStakeTokenSuccess(true);
        }
    }, [notifications, showERC20ApprovalSuccess, showStakeTokenSuccess])

    return (
        <>
            {/* <div> */}
            <Input onChange={handleInputChange} />
            <Button color="primary" size="large" onClick={handleStakeSubmit} disabled={isMining}>{isMining ? <CircularProgress size={26} /> : "Stake"}</Button>
            {/* </div> */}
            <Snackbar open={showERC20ApprovalSuccess} autoHideDuration={5000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    ERC-20 token transfer approve! Now approve the 2nd transaction.
                </Alert>
            </Snackbar>
            <Snackbar open={showStakeTokenSuccess} autoHideDuration={5000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Tokens Staked!
                </Alert>
            </Snackbar>
        </>
    );
}
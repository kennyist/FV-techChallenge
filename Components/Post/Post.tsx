import React, {FunctionComponent, memo, useEffect, useMemo, useState} from "react";
import {jsx} from "@emotion/react";
import { styled } from '@mui/system';
import {Map} from "immutable";

import {Button, Card, CardActions, CardContent, CardProps, Typography, TypographyProps} from "@mui/material";

import {GenericLoadingState, IComment} from "../../Models";
import {CONSTANT_API_URL} from "../../Constants";
import {Comment} from "../Comment";

import {PostProps} from "./IPost";

import JSX = jsx.JSX;

const RootCard = styled((props: CardProps) => <Card {...props} />)(() => ({
    maxWidth: 600,
    marginBottom: 20
}));

const CommentTitle = styled((props: TypographyProps) => <Typography {...props} variant="h6" >Comments:</Typography>)(() => ({
    marginTop: 10,
    marginBottom: 5
}));

const Post: FunctionComponent<PostProps> = ({
     post
}) => {

    // State

    const [loadingState, setLoadingState] = useState<GenericLoadingState>();
    const [showComments, setShowComments] = useState<boolean>(false);
    const [comments, setComments] = useState<Map<number, IComment>>(Map<number, IComment>());

    // Life cycle

    useEffect(() => {
        handleFetchComments();
    }, [])

    // region handlers

    const handleFetchComments = async (): Promise<void> => {
        setLoadingState(GenericLoadingState.Loading);

        const response = await fetch(`${CONSTANT_API_URL}/posts/${post.id}/comments`);

        if(!response.ok){
            setLoadingState(GenericLoadingState.Fail);
            return;
        }

        const responseComments = await response.json() as IComment[] ?? [];

        setComments(comments.withMutations(mutable => {
            for (const commentItem of responseComments) {
                mutable.set(commentItem.id, commentItem);
            }
        }));

        setLoadingState(GenericLoadingState.Success);
    }

    const handleToggleShowComments = (): void => {
        setShowComments(!showComments);
    }

    const handleRenderComments = (commentItems: Map<number, IComment>): JSX.Element[] => {
        const elements: JSX.Element[] = [];

        if(commentItems.size <= 0){
            return elements;
        }

        elements.push(<CommentTitle />)

        for (const commentItem of commentItems.values()) {
            elements.push(<Comment key={commentItem.id} comment={commentItem} />)
        }

        return elements;
    }

    // endregion handlers

    // region render

    const commentElements = useMemo(() => handleRenderComments(comments), [comments]);
    const commentCount = loadingState === GenericLoadingState.Success ? comments.size : 0;

    return (
        <RootCard key={post.id}>
            <CardContent>

                <Typography variant="h5" gutterBottom>
                    {post.title}
                </Typography>

                <Typography>
                    { post.body }
                </Typography>

                { showComments && commentElements}
            </CardContent>

            <CardActions>
                <Button onClick={handleToggleShowComments}>
                    { showComments ? `Hide ${commentCount} Comments` : `Show ${commentCount} Comments`}
                </Button>
            </CardActions>
        </RootCard>
    );

    // endregion render
};

export default memo(Post);
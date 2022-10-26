import type {NextPage} from "next";
import {useEffect, useMemo, useState} from "react";
import {Map} from "immutable";
import {jsx} from "@emotion/react";

import {styled} from '@mui/system';
import {Container, Typography} from "@mui/material";

import {GenericLoadingState, IPost} from "../Models";
import {CONSTANT_API_URL} from "../Constants";
import {Post} from "../Components/Post";

import JSX = jsx.JSX;

const FeedContent = styled('div')({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  padding: 25
});

const Feed: NextPage = () => {

  // State

  const [loadingState, setLoadingState] = useState<GenericLoadingState>();
  const [posts, setPosts] = useState<Map<number, IPost>>(Map<number, IPost>());

  // Life Cycle

  useEffect(() => {
    handleFetchPosts();
  }, []) // not sure why removing the empty array causes infinite reload


  // region handlers

  const handleFetchPosts = async (): Promise<void> => {
    setLoadingState(GenericLoadingState.Loading);

    const response = await fetch(CONSTANT_API_URL + "/posts");

    if(!response.ok){
      setLoadingState(GenericLoadingState.Fail);
      return;
    }

    const responsePosts = await response.json() as IPost[] ?? [];

    setPosts(posts.withMutations(mutable => {
      for (const postItem of responsePosts) {
        mutable.set(postItem.id, postItem);
      }
    }));
    setLoadingState(GenericLoadingState.Success);
  }

  const handleRenderPosts = (postItems: Map<number, IPost>): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    if(postItems.size <= 0){
      return elements;
    }

    for (const postItem of postItems.values()) {
      elements.push(<Post key={postItem.id} post={postItem} />)
    }

    return elements;
  }

  // endregion

  // region render

  // Memo this function to minimize render calls for this mostly static list
  const postElements = useMemo(() => handleRenderPosts(posts), [posts]);

  return <Container>
      <FeedContent>
      {loadingState === GenericLoadingState.Loading && <Typography>Loading Posts</Typography> }
      {loadingState === GenericLoadingState.Fail && <Typography>Failed to load posts</Typography> }
      {loadingState === GenericLoadingState.Success && postElements }
    </FeedContent>
  </Container>;


  // endregion
};

export default Feed;

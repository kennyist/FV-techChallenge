import type {NextPage} from "next";
import {useEffect, useMemo, useState} from "react";
import {Map} from "immutable";

import {Container, Grid, Typography} from "@mui/material";


import {GenericLoadingState, IPhoto} from "../Models";
import {CONSTANT_API_URL} from "../Constants";
import {FullScreenImage, GridImage} from "../Components";

const Vault: NextPage = () => {

    // State

    const [loadingState, setLoadingState] = useState<GenericLoadingState>();
    const [photos, setPhotos] = useState<Map<number, IPhoto>>(Map<number, IPhoto>());
    const [fullScreenPhoto, setFullScreenPhoto] = useState<IPhoto | undefined>();

    // Life Cycle

    useEffect(() => {
        handleFetchImages();
    }, []) // not sure why removing the empty array causes infinite reload

    // region handlers

    const handleFetchImages = async (): Promise<void> => {
        setLoadingState(GenericLoadingState.Loading);

        const response = await fetch(CONSTANT_API_URL + "/photos");

        if(!response.ok){
            setLoadingState(GenericLoadingState.Fail);
            return;
        }

        const responsePosts = await response.json() as IPhoto[] ?? [];

        setPhotos(photos.withMutations(mutable => {
            for (const photoItem of responsePosts) {
                mutable.set(photoItem.id, photoItem);
            }
        }));
        setLoadingState(GenericLoadingState.Success);
    }

    const handleRenderPhotos = (photoItems: Map<number, IPhoto>): JSX.Element[] => {
        const elements: JSX.Element[] = [];

        if(photoItems.size <= 0){
            return elements;
        }

        for (const photoItem of photoItems.values()) {
            elements.push(<GridImage key={photoItem.id} photo={photoItem} onPhotoClicked={handleImageClicked} />)
        }

        return elements;
    }

    const handleImageClicked = (id: number): void => {
        if(!photos.has(id)){
            console.warn(`Image not found for id: ${id}`)
            return;
        }

        setFullScreenPhoto(photos.get(id));
    }

    const handleFullScreenImageClose = (): void => {
        setFullScreenPhoto(undefined);
    }

    // endregion

    // region render

    // Memo this function to minimize render calls for this mostly static list
    const photoElements = useMemo(() => handleRenderPhotos(photos), [photos]);

    if(loadingState !== GenericLoadingState.Success){
        return (
            <>
                {loadingState === GenericLoadingState.Loading && <Typography>Loading Photos</Typography> }
                {loadingState === GenericLoadingState.Fail && <Typography>Failed to load Photos</Typography> }
            </>
        )
    }

    return <>
        <Container>
            <Grid container spacing={2}>
                {loadingState === GenericLoadingState.Success && photoElements }
            </Grid>
        </Container>

        <FullScreenImage photo={fullScreenPhoto} onClose={handleFullScreenImageClose} />
    </>

    // endregion
}

export default Vault;
import React, {FunctionComponent, memo} from "react";

import {Modal, Typography} from "@mui/material";
import { styled } from '@mui/system';

import {FullScreenImageProps} from "./IFullScreenImage";

const ImageContainer = styled('div')({
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none"
});

const FullScreenImage: FunctionComponent<FullScreenImageProps> = ({
    photo,

    onClose
}) => {

    // region render

    return (
        <Modal
            open={!!photo}

            onClose={onClose}
        >
            <ImageContainer>
                { !photo?.url ?
                    <Typography>Unable to display image</Typography> :
                    <img
                        src={photo?.url}
                        alt={photo?.title}
                    />
                }
            </ImageContainer>
        </Modal>
    );

    // endregion render
};

export default memo(FullScreenImage);
import React, {FunctionComponent, memo} from "react";

import {Box, Grid} from "@mui/material";

import {GridImageProps} from "./IGridImage";

const GridImage: FunctionComponent<GridImageProps> = ({
    photo,

    onPhotoClicked
}) => {

    // region handlers

    const handleOnClick = (): void => {
        onPhotoClicked && onPhotoClicked(photo.id);
    }

    // endregion handlers

    // region render

    return (
        <Grid item>
            <Box
                component={"img"}
                src={photo.thumbnailUrl}
                alt={photo.title}
                onClick={handleOnClick}
            />
        </Grid>
    );

    // endregion render
};

export default memo(GridImage);
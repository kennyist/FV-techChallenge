import React, {FunctionComponent, memo} from "react";

import {CommentProps} from "./IComment";
import {Box, Typography} from "@mui/material";

const Comment: FunctionComponent<CommentProps> = ({
                                                      comment
                                                  }) => {

    // region render

    return (
        <Box
            key={comment.id}
            sx={{
                marginTop: 1
            }}
        >
            <Typography gutterBottom>
                { comment.name }
            </Typography>
            <Typography variant="subtitle2">
                {comment.body}
            </Typography>
        </Box>
    );

    // endregion render
};

export default memo(Comment)
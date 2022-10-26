import {IPhoto} from "../../Models";

export interface FullScreenImageProps {
    photo?: IPhoto;

    onClose?: () => void;
}
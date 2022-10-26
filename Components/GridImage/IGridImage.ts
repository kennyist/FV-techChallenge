import {IPhoto} from "../../Models";

export interface GridImageProps {
    photo: IPhoto;

    onPhotoClicked?: (id: number) => void;
}
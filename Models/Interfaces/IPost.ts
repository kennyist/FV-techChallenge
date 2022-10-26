export interface IPost {
    id: number;
    userId: string;
    title: string;
    body: string;
    comments?: Map<string, any>
}
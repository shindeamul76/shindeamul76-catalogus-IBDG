


export interface TaskData {
    taskId: string;
    imageUrl: string;
    status: "Pending" | "Processing" | "Success" | "Failed";
    timestamp: string;
}
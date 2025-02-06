"use client";


import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { TaskData } from "@/types/task-type";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const queryClient = useQueryClient();

  // Keep previous data to reduce flicker during pagination
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["tasks", currentPage],
    queryFn: async () => {
      const response = await axios.get(
        `/api/get-tasks?page=${currentPage}&limit=${tasksPerPage}`
      );
      return response.data;
    },

    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const submitTaskMutation = useMutation({
    mutationFn: async () => {
      await axios.post("/api/submit-task", { imageUrl });
    },
    onSuccess: () => {
      setImageUrl("");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSubmit = () => {
    if (!imageUrl) return;
    submitTaskMutation.mutate();
  };

  const tasks = data?.tasks || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">
        IMAGE-BASED DATA GENERATION
      </h1>

      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
        {/* Submit Section */}
        <div className="flex space-x-2 mb-4">
          <Input
            className="flex-grow h-12"
            placeholder="Enter Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button
            className="flex-grow h-12 transition duration-300 ease-in-out bg-blue-500 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
            disabled={submitTaskMutation.isPending}
          >
            {submitTaskMutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <p className="text-center text-gray-500">Loading tasks...</p>
        )}
        {isError && (
          <p className="text-center text-red-500">
            Failed to fetch tasks. Please try again.
          </p>
        )}

        {/* Task List */}
        {!isLoading && !isError && (
          <>
            <h2 className="text-lg font-semibold mb-4 text-blue-700">
              Task List
            </h2>
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task: TaskData) => (
                  <Card
                    key={task.taskId}
                    className="p-4 flex items-center justify-between border rounded-lg shadow-sm cursor-pointer transition duration-300 ease-in-out hover:bg-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Fallback image if status is "Failed" */}
                      <Image
                        src={
                          task.status === "Failed"
                            ? "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4="
                            : task.imageUrl
                        }
                        alt="task"
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center text-center space-y-2">
                      <p className="text-sm font-medium">
                        Task ID: {task.taskId}
                      </p>
                    </div>
                    <Badge
                      className={`w-24 flex items-center justify-center space-x-1 text-center py-1 rounded-md text-white font-semibold ${
                        task.status === "Success"
                          ? "bg-green-500"
                          : task.status === "Failed"
                          ? "bg-red-500"
                          : task.status === "Processing"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-500"
                      }`}
                    >
                      {task.status === "Processing" && (
                        <Loader2 className="animate-spin h-4 w-4" />
                      )}
                      <span>{task.status}</span>
                    </Badge>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-center">No tasks found.</p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                <Button
                  className="transition duration-300 ease-in-out hover:bg-gray-300"
                  disabled={currentPage === 1 || isFetching}
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                >
                  <ChevronLeft />
                </Button>
                <p className="text-lg font-medium">
                  {currentPage} / {totalPages}
                </p>
                <Button
                  className="transition duration-300 ease-in-out hover:bg-gray-300"
                  disabled={currentPage === totalPages || isFetching}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < totalPages ? prev + 1 : totalPages
                    )
                  }
                >
                  <ChevronRight />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

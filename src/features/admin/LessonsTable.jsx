import { useState } from "react";

import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationItem,
  PaginationNext,
  PaginationLink,
  PaginationContent,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ViewLessonModal from "./lessons/ViewLessonModal";
import DeleteLessonModal from "./lessons/DeleteLessonModal";
import { LessonModalFrom } from "@/components/dashboard/LessonModal";

const ITEMS_PER_PAGE = 5;

export default function LessonsTable({ lessons = [] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(lessons.length / ITEMS_PER_PAGE);

  const paginatedLessons = lessons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-xl shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Class Level</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedLessons.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No lessons found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedLessons.map((lesson) => (
                <TableRow key={lesson._id}>
                  <TableCell className="font-medium">
                    {lesson.title || "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {lesson.description || "-"}
                  </TableCell>
                  <TableCell>{lesson.classLevel || "N/A"}</TableCell>
                  <TableCell>
                    {lesson.isPaid ? `${lesson.price || 0} EGP` : "Free"}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <ViewLessonModal lesson={lesson} />
                    <LessonModalFrom use="Edit" id={lesson?._id} paginatedLessons={paginatedLessons}/>
                    <DeleteLessonModal lessonId={lesson?._id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

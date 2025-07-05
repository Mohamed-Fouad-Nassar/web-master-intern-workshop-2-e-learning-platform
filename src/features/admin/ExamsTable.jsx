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
import EditExamModal from "./exams/EditExamModal";
import ViewExamModal from "./exams/ViewExamModal";
import DeleteExamModal from "./exams/DeleteExamModal";

const ITEMS_PER_PAGE = 5;

export default function ExamsTable({ exams }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(exams.length / ITEMS_PER_PAGE);

  const paginatedExams = exams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Class Level</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExams.map((exam) => (
              <TableRow key={exam._id}>
                <TableCell>{exam.title}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {exam.description}
                </TableCell>
                <TableCell>{exam.classLevel}</TableCell>
                <TableCell>{exam.duration} min</TableCell>
                <TableCell>{exam.questions?.length ?? 0}</TableCell>
                <TableCell>
                  {new Date(exam.startDate).toLocaleDateString()}
                  {/* {formatDate(exam.startDate)} */}
                </TableCell>
                <TableCell>
                  {new Date(exam.endDate).toLocaleDateString()}
                  {/* {formatDate(exam.endDate)} */}
                </TableCell>
                <TableCell className="space-x-2">
                  <ViewExamModal exam={exam} />
                  <EditExamModal selectedExam={exam} />
                  <DeleteExamModal examId={exam?._id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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

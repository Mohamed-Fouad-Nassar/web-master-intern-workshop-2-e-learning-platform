import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import UpdateExamForm from "../UpdateExamForm";
import { Button } from "@/components/ui/button";

export default function EditExamModal({ selectedExam }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-6rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Exam</DialogTitle>
        </DialogHeader>
        <UpdateExamForm exam={selectedExam} />
      </DialogContent>
    </Dialog>
  );
}

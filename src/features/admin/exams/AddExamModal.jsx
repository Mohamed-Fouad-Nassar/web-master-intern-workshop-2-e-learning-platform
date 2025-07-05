import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddExamForm from "../AddExamForm";
import { Button } from "@/components/ui/button";

export default function AddExamModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex gap-2">
          <PlusCircle size={16} />
          Add Exam
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exam</DialogTitle>
        </DialogHeader>
        <AddExamForm />
      </DialogContent>
    </Dialog>
  );
}

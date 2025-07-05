import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddLessonForm from "./AddLessonForm";
import { Button } from "@/components/ui/button";

export default function AddLessonModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex gap-2">
          <PlusCircle size={16} />
          Add Lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
        </DialogHeader>
        <AddLessonForm />
      </DialogContent>
    </Dialog>
  );
}

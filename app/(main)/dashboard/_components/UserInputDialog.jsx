import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CoachingExpert } from "@/services/Options";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function UserInputDialog({ children, coachingOption }) {
  const [topic, setTopic] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [open, setOpen] = useState(false) 
  const router = useRouter()

  const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);

  const handleSubmit = async () => {
    if (!topic || !selectedExpert) return;
    setIsLoading(true);
    const result = await createDiscussionRoom({
      topic,
      expertName: selectedExpert,
      coachingOption: coachingOption.name,
    });
    setIsLoading(false);
    setOpen(false);
    setTopic("");
    setSelectedExpert(null);

    router.push(`/discussion-room/${result}`)
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coachingOption.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3 ">
              <h2 className="text-gray-500">
                Enter a topic to master your skills in {coachingOption?.name}
              </h2>

              <Textarea
                placeholder="Enter your topic here..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={"mt-2"}
              />

              <h2 className="text-gray-500 mt-5 ">
                Select your coaching expert
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
                {CoachingExpert.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => setSelectedExpert(item.name)}
                    className={cn("p-1 rounded-lg", {
                      "border-2 border-primary": selectedExpert === item.name,
                    })}
                  >
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-2xl h-[80px] w-[80px] object-cover hover:scale-105 transition-all cursor-pointer"
                    />
                    <h2 className="text-center">{item.name}</h2>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end mt-5">
                <DialogClose asChild>
                  <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleSubmit}
                  disable={(!topic || !selectedExpert || isLoading).toString()}
                >
                 {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Next"}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UserInputDialog;

"use client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { ExpertsList } from "@/services/Options";
import { useUser } from "@stackframe/stack";
import Image from "next/image";
import React from "react";
import UserInputDialog from "./UserInputDialog";

function FeatureAssistant() {
  const user = useUser();
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-medium text-gray-500">My Workspace</h2>
          <h3 className="font-bold text-3xl">
            Welcome back, {user.displayName}
          </h3>
        </div>

        <Button variant={"default"}>Profile </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cools-5 py-5 gap-10">
        {ExpertsList.map((option, index) => (
          <BlurFade key={option.name} delay={0.25 + index * 0.05} inView>
            <UserInputDialog coachingOption={option}>
              <div className="p-3 bg-secondary rounded-xl flex flex-col justify-center items-center ">
                <Image
                  src={option.icon}
                  width={150}
                  height={150}
                  className="h-[70px] w-[70px] hover:rotate-12 cursor-pointer transition-all"
                  alt={option.name}
                />
                <h2>{option.name}</h2>
              </div>
            </UserInputDialog>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default FeatureAssistant;

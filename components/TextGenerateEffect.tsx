"use client";

import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const words = `Transforming Concepts into Seamless User Experiences
`;

export default function TextGenerateEffectComp() {
  return (
    <TextGenerateEffect
      className="text-center text-[40px] md:text-5xl lg:text-6xl"
      words={words}
    />
  );
}

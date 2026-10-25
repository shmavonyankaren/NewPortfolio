"use client";
import { usePublicText } from "@/i18n/text";


import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const words = `Transforming Concepts into Seamless User Experiences
`;

export default function TextGenerateEffectComp() {
 const t = usePublicText();
  return (
    <TextGenerateEffect
      className="text-center text-[40px] md:text-5xl lg:text-6xl"
      words={t(words)}
    />
  );
}

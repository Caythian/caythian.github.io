import { Fragment } from "react";

// Renders text with *asterisks* around a phrase as italics, e.g. "*Wolf Peach* builds…"
export default function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*([^*]+)\*/).map((part, index) =>
        index % 2 === 1 ? (
          <em key={index}>{part}</em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

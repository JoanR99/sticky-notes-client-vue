import type { Color } from "../schemas/noteSchemas";

function getColor(color: Color) {
  switch (color) {
    case "blue":
      return "bg-blue-200";
    case "green":
      return "bg-green-200";
    case "yellow":
      return "bg-yellow-200";
    case "brown":
      return "bg-stone-300";
    case "pink":
      return "bg-pink-200";
    case "red":
      return "bg-red-200";
    case "orange":
      return "bg-orange-200";
    case "purple":
      return "bg-purple-200";
    case "white":
      return "bg-white";
    case "gray":
      return "bg-gray-200";
    case "teal":
      return "bg-teal-200";
  }
}

export default getColor;

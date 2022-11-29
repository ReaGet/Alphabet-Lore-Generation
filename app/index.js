import "./styles/styles.scss";
import Wheel from "./js/wheel.js";
import Canvas from "./js/canvas.js";
import sectors from "./js/sectors.js";
import { letters } from "./js/letters.js";
import spriteSheetPng from "./img/letters2.png";

const spriteSheet = new Image();
spriteSheet.src = spriteSheetPng;
spriteSheet.onload = () => {
  console.log("Sprite Sheet is Loaded");
};

const wheel = new Wheel(
  document.querySelector(".wheel__wrapper")
);

const result = new Canvas(
  document.querySelector(".result")
);

wheel.set(sectors);

wheel.on("finish", (letter) => {
  result.image(spriteSheet, letters[letter.label].pos);
  console.log(
    letter,
    letters[letter.label]
  );
});
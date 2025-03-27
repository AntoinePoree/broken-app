/// <reference lib="webworker" />

import { PerformanceExercise } from "./performance-exercise.component";

addEventListener('message', ({ data }) => {
  const results = heavyCalculation(data);
  postMessage(results);
});

function heavyCalculation(data: number[]): Array<PerformanceExercise> {
  return data.map((n, id) => {
    let value = n;
    for (let i = 0; i < 1000000; i++) {
      value = Math.sqrt(value * i);
    }
    return { id, value: Math.round(value) };
  });
}
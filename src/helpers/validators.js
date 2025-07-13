/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    allPass, equals, filter, length, pipe, prop, values, all
} from 'ramda';

const getColorCount = (color) => pipe(values, filter(equals(color)), length);
const shapeIs = (shape) => (color) => pipe(prop(shape), equals(color));
const allColorsAre = (color) => pipe(values, all(equals(color)));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    shapeIs('star')('red'),
    shapeIs('square')('green'),
    shapeIs('triangle')('white'),
    shapeIs('circle')('white'),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(getColorCount('green'), (count) => count >= 2);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) =>
    getColorCount('red')(figures) === getColorCount('blue')(figures);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    shapeIs('circle')('blue'),
    shapeIs('star')('red'),
    shapeIs('square')('orange'),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (figures) =>
    ['red', 'green', 'blue', 'orange'].some(
        (color) => getColorCount(color)(figures) >= 3
    );

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    pipe(getColorCount('green'), equals(2)),
    shapeIs('triangle')('green'),
    pipe(getColorCount('red'), equals(1)),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allColorsAre('orange');

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = pipe(
    prop('star'),
    (color) => !['red', 'white'].includes(color)
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allColorsAre('green');

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    (figures) => figures.triangle === figures.square,
    pipe(prop('triangle'), (c) => c !== 'white'),
]);

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';

const apiClient = new Api();

const every =
    (...preds) =>
        (...args) =>
            preds.every((p) => p(...args));

const flow =
    (...fns) =>
        (x) =>
            fns.reduce((v, f) => f(v), x);

const flowAsync =
    (...fns) =>
        async (x) => {
            let res = x;
            for (const f of fns) res = await f(res);
            return res;
        };

const trace =
    (fx) =>
        (x) => (fx(x), x);

const convertNumber =
    (from, to) =>
        (num) =>
            apiClient
                .get('https://api.tech/numbers/base', { from, to, number: num })
                .then(({ result }) => result);

const fetchAnimal =
    (id) =>
        apiClient
            .get(`https://animals.tech/${id}`, {})
            .then(({ result }) => result);


const isValidInput = every(
    (s) => s.length > 2 && s.length < 10,
    (s) => /^[0-9.]+$/.test(s),
    (s) => !Number.isNaN(parseFloat(s)),
    (s) => parseFloat(s) > 0
);

const toRoundedInt = flow(parseFloat, Math.round);

export default async function processSequence({value, writeLog, handleSuccess, handleError,}) {
    const log = trace(writeLog);

    log(value);

    if (!isValidInput(value)) {
        handleError('ValidationError');
        return;
    }

    const rounded     = log(toRoundedInt(value));
    const binary      = await flowAsync(convertNumber(10, 2), log)(rounded);
    const length      = log(binary.length);
    const squared     = log(length ** 2);
    const remainder   = log(squared % 3);

    await flowAsync(fetchAnimal, handleSuccess)(remainder);
}

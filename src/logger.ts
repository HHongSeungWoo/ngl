import {boolean, getQuery} from "./utils";

export const Log = {
    log: Function.prototype.bind.call(console.log, console),
    info: Function.prototype.bind.call(console.info, console),
    warn: Function.prototype.bind.call(console.warn, console),
    error: Function.prototype.bind.call(console.error, console),
    time: Function.prototype.bind.call(console.time, console),
    timeEnd: Function.prototype.bind.call(console.timeEnd, console)
}

export let Debug = boolean(getQuery('debug'))

export function setDebug(value: boolean) {
    Debug = value
}
/**
 * @file UI Parameters
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */
import { StageParameters } from '../stage/stage';
export type BooleanParam = {
    type: 'boolean';
};
export type ColorParam = {
    type: 'color';
};
export type IntegerParam = {
    type: 'integer';
    max: number;
    min: number;
};
export type NumberParam = {
    type: 'number';
    precision: number;
    max: number;
    min: number;
};
export type RangeParam = {
    type: 'range';
    step: number;
    max: number;
    min: number;
};
export type SelectParam = {
    type: 'select';
    options: {
        [k: string]: string;
    };
};
export type ParamType = BooleanParam | ColorParam | IntegerParam | NumberParam | RangeParam | SelectParam;
export declare const UIStageParameters: {
    [k in keyof StageParameters]: ParamType;
};

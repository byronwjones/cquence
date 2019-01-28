const privado = (Math.random() * 1000000).toString();

type NormalMap = {[key:string]: any};

/// <reference path="interfaces/interfaces.ts" />

type UnitFunction = (unitConductor: IConductorInterface) => void;

type ExecutionTarget = UnitFunction | IConductorBuilder;
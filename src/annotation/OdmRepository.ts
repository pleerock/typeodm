import {Container} from "typedi/Container";
import {ConnectionManager} from "../connection/ConnectionManager";

export function OdmRepository(className: Function, connectionName?: string): Function;
export function OdmRepository(className: string, connectionName?: string): Function;
export function OdmRepository(className: Function|string, connectionName?: string): Function {
    return function(target: Function, key: string, index: number) {

        Container.registerCustomParamHandler({
            type: target,
            index: index,
            getValue: () => {
                let connectionManager = Container.get<ConnectionManager>(ConnectionManager);
                let connection = connectionManager.getConnection(connectionName);
                return connection.getRepository(<Function> className);
            }
        });
    }
}

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export function groupByPermissions(data: any[]): any[] {
    const response: any[] = [];
    const groupedData: any = {};
    if (!data) return [];

    data.forEach((item) => {
        const permissionName = item.name.split('.')[1];
        const perName = item.name.split('.')[2];
        if (!groupedData[permissionName]) {// @ts-ignore
            groupedData[permissionName] = new Set<string>();
        }// @ts-ignore
        groupedData[permissionName].add(perName);
    });

    const allPerNames = new Set<string>();
    for (const permissionName in groupedData) {
        for (const perName of groupedData[permissionName]) {
            // @ts-ignore
            allPerNames.add(perName);
        }
    }

    const sortedPerNames = Array.from(allPerNames);

    for (const permissionName in groupedData) {
        const permissionArray: (string | null)[] = [];
        for (const perName of sortedPerNames) {// @ts-ignore
            permissionArray.push(groupedData[permissionName].has(perName) ? perName : null);
        }
        const permissionItemArray = permissionArray.map((perName) => {
            const foundItem = data.find((item) => item.name.split('.')[1] === permissionName && item.name.split('.')[2] === perName);
            const newItem = {...foundItem, indentity: permissionName}
            return foundItem ? newItem : null;
        });
        // @ts-ignore
        const permissionObject: ResponseItem = {
            // @ts-ignore
            [permissionName]: permissionItemArray,

        };
        response.push(permissionObject);
    }

    return response;
}

export const getQuantityOfPermission = (data: any[]) => {
    if (!data) return null;
    const dataname = data?.map((i) => i.name?.split('.')?.at(-1));
    return dataname.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});
}

export function matchingTwoObject(obj1: any, ob2: any): any[] {
    if (!(obj1 || ob2)) return []
    else {
        const matchingKeys = [];
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(ob2);

        for (const key of keys1) {
            if (keys2.includes(key) && obj1[key] === ob2[key]) {
                matchingKeys.push(key);
            }
        }
        return matchingKeys;
    }
}


export function getUniquePermissions(array1: any, array2: any) {
    if(!(array1 || array2)) return [];
    const setA = new Set(array1.map((item: any) => item._id));
    const uniqueElements = array2.filter((item: any) => {
        if (!setA.has(item._id)) {
            setA.add(item.name);
            return item;
        }
    });

    return uniqueElements;
}